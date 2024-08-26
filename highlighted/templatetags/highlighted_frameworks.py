from django import template
from highlighted.models import HighlightedFramework

register = template.Library()


@register.simple_tag
def get_highlighted_frameworks(limit=4):

    return HighlightedFramework.objects.select_related("framework").filter(
        framework__published_at__isnull=False
    )[:limit]
