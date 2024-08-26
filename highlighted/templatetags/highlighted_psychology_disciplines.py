from django import template
from highlighted.models import HighlightedPsychologyDiscipline

register = template.Library()


@register.simple_tag
def get_highlighted_psychology_disciplines(limit=4):

    return HighlightedPsychologyDiscipline.objects.select_related(
        "psychology_discipline"
    ).filter(psychology_discipline__published_at__isnull=False)[:limit]
