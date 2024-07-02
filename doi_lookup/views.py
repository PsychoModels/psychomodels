from django.http import JsonResponse, HttpResponseBadRequest
from .services import CrossRefClient
import re


def is_valid_doi(doi):
    pattern = r"^10.\d{4,9}/[-._;()/:A-Z0-9]+$"
    match = re.match(pattern, doi, re.IGNORECASE)
    return bool(match)


def lookup_doi(request, doi):
    if not is_valid_doi(doi):
        return HttpResponseBadRequest("Invalid DOI format")
    try:
        client = CrossRefClient()
        out = client.doi2json(doi)

        return JsonResponse(out)

    except Exception as e:
        return HttpResponseBadRequest(f"Error fetching DOI information: {str(e)}")
