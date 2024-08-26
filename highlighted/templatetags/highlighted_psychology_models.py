from django import template
from highlighted.models import HighlightedPsychologyModel

register = template.Library()


@register.simple_tag
def get_highlighted_psychology_models(limit=4):

    return HighlightedPsychologyModel.objects.select_related("psychology_model").filter(
        psychology_model__published_at__isnull=False
    )[:limit]
