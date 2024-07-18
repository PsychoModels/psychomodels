from typing import Any, Dict

import json
from django.shortcuts import render
from django.views import generic
from psychology_models.models import (
    PsychologyModel,
    Framework,
    SoftwarePackage,
    PsychologyDiscipline,
    Variable,
)


class ModelDetailView(generic.DetailView):
    model = PsychologyModel

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        return super().get_context_data(**kwargs)


def psychology_model_search(request):
    return render(request, "psychology_models/psychologymodel_search.html")


def psychology_model_create(request):
    frameworks = Framework.objects.exclude(published_at__isnull=True)
    software_packages = SoftwarePackage.objects.exclude(published_at__isnull=True)
    psychology_disciplines = PsychologyDiscipline.objects.exclude(
        published_at__isnull=True
    )
    variables = Variable.objects.exclude(published_at__isnull=True)

    frameworks_json = json.dumps(
        list(frameworks.values("id", "name", "description", "parent_framework"))
    )
    software_packages_json = json.dumps(
        list(
            software_packages.values(
                "id",
                "name",
                "documentation_url",
                "code_repository_url",
                "programming_language",
            )
        )
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
            "software_packages": software_packages_json,
            "psychology_disciplines": psychology_disciplines_json,
            "variables": variables_json,
        },
    )


def detail_view_dev(request):
    return render(
        request,
        "psychology_models/psychologymodel_detail_dev.html",
    )
