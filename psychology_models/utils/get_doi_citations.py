import requests
from django.utils import timezone
import re
from doi_lookup.services import CrossRefClient
from django.contrib import messages as django_messages


def is_valid_doi(doi):
    pattern = r"^10.\d{4,9}/[-._;()/:A-Z0-9]+$"
    match = re.match(pattern, doi, re.IGNORECASE)
    return bool(match)


def fetch_and_save(instance, fetch_function, attribute_name, fetched_at_name, refetch):
    now = timezone.now()
    messages = []

    if getattr(instance, fetched_at_name) is not None or refetch:
        try:
            result = fetch_function(instance.publication_doi)
            setattr(instance, attribute_name, result)
            setattr(instance, fetched_at_name, now)
            instance.save()
            messages.append(
                (
                    f"fetched {attribute_name} for DOI {instance.publication_doi}  #({instance.id})",
                    django_messages.SUCCESS,
                )
            )
        except Exception as e:
            if (
                isinstance(e, requests.exceptions.HTTPError)
                and e.response.status_code == 404
            ):
                messages.append(
                    (
                        f"{attribute_name} for DOI {instance.publication_doi} not found #({instance.id})",
                        django_messages.ERROR,
                    )
                )
            else:
                messages.append(
                    (
                        f"error fetching {attribute_name} for DOI {instance.publication_doi}  #({instance.id})",
                        django_messages.ERROR,
                    )
                )
    return messages


def get_doi_citations(queryset, refetch):
    client = CrossRefClient()
    messages = []

    for instance in queryset:
        if instance.publication_doi is not None and is_valid_doi(
            instance.publication_doi
        ):
            messages.extend(
                fetch_and_save(
                    instance,
                    client.doi2apa,
                    "publication_citation",
                    "publication_citation_fetched_at",
                    refetch,
                )
            )
            messages.extend(
                fetch_and_save(
                    instance,
                    client.doi2json,
                    "publication_csl_json",
                    "publication_csl_fetched_at",
                    refetch,
                )
            )
        else:
            messages.append(
                (
                    f"Invalid DOI {instance.publication_doi} #({instance.id})",
                    django_messages.ERROR,
                )
            )
    return messages
