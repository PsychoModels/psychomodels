from typing import Any, Dict
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
import json

from django.forms import model_to_dict
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.views import generic

from psychology_models.models import (
    PsychologyModel,
    Framework,
    PsychologyDiscipline,
    Variable,
    ProgrammingLanguage, PsychologyModelDraft,
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

    draft_id = request.GET.get('draft_id')

    page_title = "Submit a new psychology computational model"
    breadcrumb_title = "Submit new model"

    if draft_id:
        existing_draft = get_object_or_404(PsychologyModelDraft, id=draft_id, created_by=request.user)
        title = (
                existing_draft.data.get("modelInformation", {}).get("title")
                or f"Untitled #{existing_draft.id}"
        )
        page_title = f"Continue submitting {title} (Draft)"
        breadcrumb_title = f"Continue submitting {title} (Draft)"

    return render(
        request,
        "psychology_models/psychologymodel_create.html",
        {
            "frameworks": frameworks_json,
            "programming_languages": programming_languages_json,
            "psychology_disciplines": psychology_disciplines_json,
            "variables": variables_json,
            "existing_draft": json.dumps(model_to_dict(existing_draft)) if draft_id else None,
            "page_title": page_title,
            "breadcrumb_title": breadcrumb_title,
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


class MyModelListView(LoginRequiredMixin, generic.ListView):
    template_name = "psychology_models/my_models_list.html"

    def get(self, request, *args, **kwargs):

        models = PsychologyModel.objects.filter(created_by=request.user).order_by('-created_at')
        drafts = PsychologyModelDraft.objects.filter(created_by=request.user).order_by('-created_at')

        models_data = list(models.values("id", "title", "published_at", "created_at", "updated_at", "slug"))

        # Format the datetime fields
        for model in models_data:
            model["published_at"] = model["published_at"].isoformat() if model["published_at"] else None
            model["created_at"] = model["created_at"].isoformat() if model["created_at"] else None
            model["updated_at"] = model["updated_at"].isoformat() if model["updated_at"] else None

        drafts_data = list(drafts.values("id", "data", "created_at", "updated_at"))

        for draft in drafts_data:
            draft["created_at"] = draft["created_at"].isoformat() if draft["created_at"] else None
            draft["updated_at"] = draft["updated_at"].isoformat() if draft["updated_at"] else None

            try:
                json_data = draft["data"] if isinstance(draft["data"], dict) else {}
                draft["title"] = json_data.get("modelInformation", {}).get("title", None)
            except Exception as e:
                draft["title"] = None

            del draft["data"]


        models_json = json.dumps(
            list(models_data)
        )
        drafts_json = json.dumps(
            list(drafts_data)
        )

        context = {
            "models": models_json,
            "drafts": drafts_json,
        }

        return render(request, self.template_name, context)