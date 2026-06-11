import json
from unittest import mock

import urllib3
from django.http import JsonResponse
from django.test import RequestFactory, SimpleTestCase, override_settings

from psychomodels.body_parsing import extract_body
from psychomodels.turnstile_middleware import TurnstileMiddleware


class ExtractBodyTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_json_body(self):
        request = self.factory.post(
            "/x/", data=json.dumps({"a": 1}), content_type="application/json"
        )
        self.assertEqual(extract_body(request), {"a": 1})

    def test_invalid_json_returns_none(self):
        request = self.factory.post(
            "/x/", data="not json", content_type="application/json"
        )
        self.assertIsNone(extract_body(request))

    def test_json_array_returns_none(self):
        request = self.factory.post(
            "/x/", data=json.dumps([1, 2]), content_type="application/json"
        )
        self.assertIsNone(extract_body(request))

    def test_form_encoded_body(self):
        request = self.factory.post("/x/", data={"a": "1"})
        body = extract_body(request)
        self.assertIs(body, request.POST)
        self.assertEqual(body.get("a"), "1")

    def test_unknown_content_type_returns_none(self):
        request = self.factory.post("/x/", data="a=1", content_type="text/plain")
        self.assertIsNone(extract_body(request))


def siteverify_response(success, error_codes=None):
    response = mock.Mock()
    response.data = json.dumps(
        {"success": success, "error-codes": error_codes or []}
    ).encode()
    return response


@override_settings(
    TURNSTILE_SECRET_KEY="test-secret",
    TURNSTILE_PROTECTED_PATHS=["/api/contact/"],
)
class TurnstileMiddlewareTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = TurnstileMiddleware(
            lambda request: JsonResponse({"ok": True})
        )

    def post(self, body, path="/api/contact/"):
        return self.factory.post(
            path, data=json.dumps(body), content_type="application/json"
        )

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_valid_token_passes(self, request_mock):
        request_mock.return_value = siteverify_response(True)
        response = self.middleware(self.post({"cf_turnstile_response": "tok"}))
        self.assertEqual(response.status_code, 200)
        request_mock.assert_called_once()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_failed_verification_rejected(self, request_mock):
        request_mock.return_value = siteverify_response(
            False, ["invalid-input-response"]
        )
        response = self.middleware(self.post({"cf_turnstile_response": "tok"}))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.content),
            {"errors": [{"code": "spam", "message": "Invalid request."}]},
        )

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_missing_token_rejected_without_api_call(self, request_mock):
        response = self.middleware(self.post({"email": "a@b.c"}))
        self.assertEqual(response.status_code, 400)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_empty_token_rejected_without_api_call(self, request_mock):
        response = self.middleware(self.post({"cf_turnstile_response": ""}))
        self.assertEqual(response.status_code, 400)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_unparseable_body_rejected(self, request_mock):
        request = self.factory.post(
            "/api/contact/", data="not json", content_type="application/json"
        )
        response = self.middleware(request)
        self.assertEqual(response.status_code, 400)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_siteverify_error_fails_open(self, request_mock):
        request_mock.side_effect = urllib3.exceptions.HTTPError("boom")
        response = self.middleware(self.post({"cf_turnstile_response": "tok"}))
        self.assertEqual(response.status_code, 200)

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_siteverify_non_json_response_fails_open(self, request_mock):
        bad_response = mock.Mock()
        bad_response.data = b"<html>503</html>"
        bad_response.status = 503
        request_mock.return_value = bad_response
        response = self.middleware(self.post({"cf_turnstile_response": "tok"}))
        self.assertEqual(response.status_code, 200)

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_unprotected_path_ignored(self, request_mock):
        response = self.middleware(self.post({"x": 1}, path="/api/other/"))
        self.assertEqual(response.status_code, 200)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_get_request_ignored(self, request_mock):
        response = self.middleware(self.factory.get("/api/contact/"))
        self.assertEqual(response.status_code, 200)
        request_mock.assert_not_called()

    @override_settings(TURNSTILE_SECRET_KEY="")
    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_disabled_without_secret_key(self, request_mock):
        response = self.middleware(self.post({"email": "a@b.c"}))
        self.assertEqual(response.status_code, 200)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_form_encoded_token_extracted(self, request_mock):
        request_mock.return_value = siteverify_response(True)
        request = self.factory.post(
            "/api/contact/", data={"cf_turnstile_response": "tok"}
        )
        response = self.middleware(request)
        self.assertEqual(response.status_code, 200)


@override_settings(TURNSTILE_SECRET_KEY="test-secret")
class TurnstileIntegrationTests(SimpleTestCase):
    """Exercise the registered middleware chain via the test client.

    Rejection happens in middleware, before any view or DB access, so
    SimpleTestCase is safe. Contact/signup bodies include an empty
    phone_number so the honeypot middleware lets them through and the 400
    is attributable to Turnstile.
    """

    def post_json(self, path, body):
        return self.client.post(
            path, data=json.dumps(body), content_type="application/json"
        )

    def assert_spam_rejection(self, response):
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.content),
            {"errors": [{"code": "spam", "message": "Invalid request."}]},
        )

    def test_contact_without_token_rejected(self):
        response = self.post_json(
            "/api/contact/",
            {
                "email": "bot@example.com",
                "subject": "spam",
                "message": "spam",
                "phone_number": "",
            },
        )
        self.assert_spam_rejection(response)

    def test_signup_without_token_rejected(self):
        response = self.post_json(
            "/_allauth/browser/v1/auth/signup",
            {"email": "bot@example.com", "password": "x", "phone_number": ""},
        )
        self.assert_spam_rejection(response)

    def test_login_without_token_rejected(self):
        response = self.post_json(
            "/_allauth/browser/v1/auth/login",
            {"email": "bot@example.com", "password": "x"},
        )
        self.assert_spam_rejection(response)

    def test_password_reset_request_without_token_rejected(self):
        response = self.post_json(
            "/_allauth/browser/v1/auth/password/request",
            {"email": "bot@example.com"},
        )
        self.assert_spam_rejection(response)
