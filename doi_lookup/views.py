from django.http import JsonResponse, HttpResponseBadRequest
from .services import CrossRefClient
import re
from django.http import HttpResponse


def is_valid_doi(doi):
    pattern = r"^10.\d{4,9}/[-._;()/:A-Z0-9]+$"
    match = re.match(pattern, doi, re.IGNORECASE)
    return bool(match)


def lookup_doi(request, doi):
    if not is_valid_doi(doi):
        return HttpResponseBadRequest("Invalid DOI format")
    try:
        client = CrossRefClient()
        return HttpResponse(client.doi2apa(doi))

    except Exception as e:
        return HttpResponseBadRequest(f"Error fetching DOI information: {str(e)}")
