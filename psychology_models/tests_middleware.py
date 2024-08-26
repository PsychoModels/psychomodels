from django.test import SimpleTestCase, RequestFactory, override_settings
from django.http import HttpResponse
from psychology_models.middleware import RedirectToMainDomainMiddleware


class RedirectToMainDomainMiddlewareTest(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.get_response = lambda request: HttpResponse("Success")
        self.middleware = RedirectToMainDomainMiddleware(self.get_response)

    @override_settings(ALLOWED_HOSTS=["*"])
    def test_redirect_from_secondary_domain(self):
        request = self.factory.get("/")
        request.META["HTTP_HOST"] = "psychomodels.com"
        response = self.middleware(request)

        self.assertEqual(response.status_code, 301)
        self.assertEqual(response.url, "https://www.psychomodels.org/")

    @override_settings(ALLOWED_HOSTS=["*"])
    def test_no_redirect_for_target_domain(self):
        request = self.factory.get("/")
        request.META["HTTP_HOST"] = "www.psychomodels.org"
        response = self.middleware(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b"Success")

    @override_settings(ALLOWED_HOSTS=["*"])
    def test_redirect_with_path(self):
        request = self.factory.get("/some/path/")
        request.META["HTTP_HOST"] = "www.psychomodels.net"

        response = self.middleware(request)

        self.assertEqual(response.status_code, 301)
        self.assertEqual(response.url, "https://www.psychomodels.org/some/path/")

    @override_settings(ALLOWED_HOSTS=["*"])
    def test_no_redirect_for_unlisted_domain(self):
        request = self.factory.get("/")
        request.META["HTTP_HOST"] = "randomdomain.com"

        response = self.middleware(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b"Success")
