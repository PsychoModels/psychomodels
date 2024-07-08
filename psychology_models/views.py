from typing import Any, Dict

from django.views import generic
from psychology_models.models import PsychologyModel


class PsychologyModelListView(generic.ListView):
    model = PsychologyModel

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        return context


class ModelDetailView(generic.DetailView):
    model = PsychologyModel

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        return super().get_context_data(**kwargs)
