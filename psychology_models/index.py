from algoliasearch_django import AlgoliaIndex
from algoliasearch_django.decorators import register

from .models import PsychologyModel


@register(PsychologyModel)
class PsychologyModelIndex(AlgoliaIndex):
    fields = (
        "title",
        "description",
        "explanation",
        "published_at",
        "updated_at",
        "publication_doi",
        "programming_language_name",
        "framework_names",
        "psychology_discipline_names",
        "publication_authors",
    )
    settings = {
        "searchableAttributes": [
            "title",
            "description",
            "explanation",
            "programming_language_name",
            "psychology_discipline_names",
        ],
        "attributesForFaceting": [
            "programming_language_name",
            "framework_names",
            "psychology_discipline_names",
            "publication_authors",
        ],
    }

    should_index = "is_published"
