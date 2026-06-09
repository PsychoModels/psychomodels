import json
import logging

from django.conf import settings
from django.http import JsonResponse, QueryDict

logger = logging.getLogger(__name__)

HONEYPOT_PATHS = [
    "/api/contact/",
    "/_allauth/browser/v1/auth/signup",
]


class JsonHoneypotMiddleware:
    """Reject POSTs to honeypot-protected paths unless the honeypot field is
    present and empty.

    Three rejection reasons:
      - "filled": honeypot field has a truthy value (classic bot tell).
      - "missing": honeypot field absent from the body. Our frontend forms
        always include it (RHF defaultValues), so absence means the request
        didn't come from a rendered form — typically a bot POSTing the
        endpoint directly with a hardcoded payload.
      - "unparseable": body couldn't be parsed for a known content type.

    Only the listed paths are guarded; if you add new endpoints, update
    HONEYPOT_PATHS and make sure the frontend form sends the honeypot field.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.field_name = getattr(settings, "HONEYPOT_FIELD_NAME", "phone_number")

    def __call__(self, request):
        if request.method == "POST" and any(
            request.path.startswith(path) for path in HONEYPOT_PATHS
        ):
            body = self._extract_body(request)
            if body is None:
                return self._reject(request, "unparseable")
            if self.field_name not in body:
                return self._reject(request, "missing")
            if body.get(self.field_name):
                return self._reject(request, "filled")

        return self.get_response(request)

    def _extract_body(self, request):
        content_type = (request.content_type or "").lower()
        if "application/json" in content_type:
            try:
                parsed = json.loads(request.body or b"{}")
            except (json.JSONDecodeError, ValueError):
                return None
            return parsed if isinstance(parsed, dict) else None
        if (
            "application/x-www-form-urlencoded" in content_type
            or "multipart/form-data" in content_type
        ):
            return request.POST
        return None

    def _reject(self, request, reason):
        logger.warning(
            "Honeypot rejected request on %s (ip: %s, reason: %s, ct: %s)",
            request.path,
            request.META.get("REMOTE_ADDR"),
            reason,
            request.content_type,
        )
        return JsonResponse(
            {"errors": [{"code": "spam", "message": "Invalid request."}]},
            status=400,
        )
