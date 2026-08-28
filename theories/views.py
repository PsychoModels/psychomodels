from typing import Any, Dict
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
import json

from django.forms import model_to_dict
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.views import generic

from psychology_models.models import PsychologyModel


class TheoryDetailView(UserPassesTestMixin, generic.DetailView):
    model = PsychologyModel
    template_name = "theories/theory_detail.html"

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        return super().get_context_data(**kwargs)

    def get_object(self, queryset=None):
        # Get the object
        obj = super().get_object(queryset=queryset)

        print(obj.is_published())
        # Check if the object is published or if the user is an admin
        if (
            obj.is_published()
            or self.request.user.is_staff
            or obj.created_by == self.request.user
        ):
            return obj
        else:
            raise Http404("Psychological theory does not exist!")

    def test_func(self):
        # Allow access if the theory is published or the user is an admin
        obj = self.get_object()
        return (
            obj.is_published()
            or self.request.user.is_staff
            or obj.created_by == self.request.user
        )


def theory_search(request):
    return render(request, "theories/theory_search.html")
