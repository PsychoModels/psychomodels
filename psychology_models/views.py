from typing import Any, Dict
from django.contrib.auth.mixins import UserPassesTestMixin
import json

from django.http import Http404
from django.shortcuts import render
from django.views import generic
from psychology_models.models import (
    PsychologyModel,
    Framework,
    PsychologyDiscipline,
    Variable,
    ProgrammingLanguage,
)


class ModelDetailView(UserPassesTestMixin, generic.DetailView):
    model = PsychologyModel

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        return super().get_context_data(**kwargs)

    def get_object(self, queryset=None):
        # Get the object
        obj = super().get_object(queryset=queryset)

        # Check if the object is published or if the user is an admin
        if (
            obj.published_at is not None
            or self.request.user.is_staff
            or obj.created_by == self.request.user
        ):
            return obj
        else:
            raise Http404("Psychology model does not exist!")

    def test_func(self):
        # Allow access if the model is published or the user is an admin
        obj = self.get_object()
        return (
            obj.published_at is not None
            or self.request.user.is_staff
            or obj.created_by == self.request.user
        )


def psychology_model_search(request):
    return render(request, "psychology_models/psychologymodel_search.html")


def psychology_model_create(request):
    frameworks = Framework.objects.exclude(published_at__isnull=True)
    programming_languages = ProgrammingLanguage.objects.exclude(
        published_at__isnull=True
    )
    psychology_disciplines = PsychologyDiscipline.objects.exclude(
        published_at__isnull=True
    )
    variables = Variable.objects.exclude(published_at__isnull=True)

    frameworks_json = json.dumps(
        list(frameworks.values("id", "name", "description", "parent_framework", "slug"))
    )
    programming_languages_json = json.dumps(
        list(programming_languages.values("id", "name"))
    )
    psychology_disciplines_json = json.dumps(
        list(psychology_disciplines.values("id", "name"))
    )
    variables_json = json.dumps(list(variables.values("id", "name", "description")))

    return render(
        request,
        "psychology_models/psychologymodel_create.html",
        {
            "frameworks": frameworks_json,
            "programming_languages": programming_languages_json,
            "psychology_disciplines": psychology_disciplines_json,
            "variables": variables_json,
        },
    )


class FrameworkDetailView(UserPassesTestMixin, generic.DetailView):
    model = Framework

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)

        framework = self.object
        related_psychology_models = PsychologyModel.objects.filter(
            framework=framework, published_at__isnull=False
        ).prefetch_related("framework", "psychology_discipline", "programming_language")

        context["related_psychology_models"] = related_psychology_models

        return context

    def get_object(self, queryset=None):
        # Get the object
        obj = super().get_object(queryset=queryset)

        # Check if the object is published or if the user is an admin
        if (
            obj.published_at is not None
            or self.request.user.is_staff
            or obj.created_by == self.request.user
        ):
            return obj
        else:
            raise Http404("Framework does not exist!")

    def test_func(self):
        # Allow access if the model is published or the user is an admin
        obj = self.get_object()
        return (
            obj.published_at is not None
            or self.request.user.is_staff
            or obj.created_by == self.request.user
        )


class FrameworkListView(generic.ListView):
    model = Framework
    context_object_name = "frameworks"

    def get_queryset(self):
        return Framework.objects.filter(published_at__isnull=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
