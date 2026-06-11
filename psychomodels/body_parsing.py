"""Shared POST-body parsing for the spam-protection middlewares."""

import json


def extract_body(request):
    """Return the request body as a dict-like object, or None if it can't
    be parsed for a known content type."""
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
