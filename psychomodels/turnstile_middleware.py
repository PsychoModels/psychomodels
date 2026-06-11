import json
import logging

import urllib3
from django.conf import settings
from django.http import JsonResponse

from psychomodels.body_parsing import extract_body

logger = logging.getLogger(__name__)

TOKEN_FIELD = "cf_turnstile_response"

http = urllib3.PoolManager()


class TurnstileMiddleware:
    """Verify a Cloudflare Turnstile token on POSTs to protected paths.

    The frontend forms render a Turnstile widget and include the resulting
    token in the request body as `cf_turnstile_response`; this middleware
    verifies it against Cloudflare's siteverify API. Rejections reuse the
    honeypot middleware's response shape so frontend error handling stays
    uniform.

    Fail-open: if siteverify itself is unreachable the request is allowed
    through (the honeypot remains as backstop) — spam protection must not
    take down signup/login during a Cloudflare outage.

    Inert when TURNSTILE_SECRET_KEY is unset (warning logged at startup).
    Settings are read per-request so override_settings works in tests.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        if not getattr(settings, "TURNSTILE_SECRET_KEY", ""):
            logger.warning(
                "TURNSTILE_SECRET_KEY is not set; Turnstile verification is disabled."
            )

    def __call__(self, request):
        secret_key = getattr(settings, "TURNSTILE_SECRET_KEY", "")
        protected_paths = getattr(settings, "TURNSTILE_PROTECTED_PATHS", [])
        if (
            secret_key
            and request.method == "POST"
            and any(request.path.startswith(path) for path in protected_paths)
        ):
            body = extract_body(request)
            if body is None:
                return self._reject(request, "unparseable")
            token = body.get(TOKEN_FIELD)
            if not token:
                return self._reject(request, "missing-token")
            if not self._verify(secret_key, token, request.META.get("REMOTE_ADDR")):
                return self._reject(request, "verification-failed")

        return self.get_response(request)

    def _verify(self, secret_key, token, remote_ip):
        verify_url = getattr(
            settings,
            "TURNSTILE_VERIFY_URL",
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        )
        payload = {"secret": secret_key, "response": token}
        if remote_ip:
            payload["remoteip"] = remote_ip
        try:
            response = http.request(
                "POST",
                verify_url,
                body=json.dumps(payload),
                headers={"Content-Type": "application/json"},
                timeout=urllib3.Timeout(total=5.0),
                retries=False,
            )
        except Exception:
            logger.exception(
                "Turnstile siteverify request failed; allowing request (fail-open)."
            )
            return True
        try:
            result = json.loads(response.data)
        except (json.JSONDecodeError, ValueError):
            logger.warning(
                "Turnstile siteverify returned non-JSON (status %s); "
                "allowing request (fail-open).",
                getattr(response, "status", None),
            )
            return True
        if result.get("success"):
            return True
        logger.info(
            "Turnstile verification failed (error-codes: %s)",
            ",".join(result.get("error-codes", [])),
        )
        return False

    def _reject(self, request, reason):
        logger.warning(
            "Turnstile rejected request on %s (ip: %s, reason: %s, ct: %s)",
            request.path,
            request.META.get("REMOTE_ADDR"),
            reason,
            request.content_type,
        )
        return JsonResponse(
            {"errors": [{"code": "spam", "message": "Invalid request."}]},
            status=400,
        )
