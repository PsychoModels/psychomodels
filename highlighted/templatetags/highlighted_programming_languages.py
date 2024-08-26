from django import template
from highlighted.models import HighlightedProgrammingLanguage

register = template.Library()


@register.simple_tag
def get_highlighted_programming_languages(limit=4):

    return HighlightedProgrammingLanguage.objects.select_related(
        "programming_language"
    ).filter(programming_language__published_at__isnull=False)[:limit]
