import json
import logging

from django.conf import settings
from django.http import JsonResponse

logger = logging.getLogger(__name__)

HONEYPOT_PATHS = [
    "/api/contact/",
    "/_allauth/browser/v1/auth/signup",
]


class JsonHoneypotMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.field_name = getattr(settings, "HONEYPOT_FIELD_NAME", "phone_number")

    def __call__(self, request):
        if request.method == "POST" and any(
            request.path.startswith(path) for path in HONEYPOT_PATHS
        ):
            content_type = request.content_type or ""
            if "application/json" in content_type:
                try:
                    body = json.loads(request.body)
                except (json.JSONDecodeError, ValueError):
                    body = {}

                honeypot_value = body.get(self.field_name, "")
                if honeypot_value:
                    logger.warning(
                        "Honeypot field filled on %s (ip: %s)",
                        request.path,
                        request.META.get("REMOTE_ADDR"),
                    )
                    return JsonResponse(
                        {"errors": [{"code": "spam", "message": "Invalid request."}]},
                        status=400,
                    )

        return self.get_response(request)
