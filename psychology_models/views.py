from typing import Any, Dict
from django.shortcuts import render
from django.views import generic
from psychology_models.models import (
    PsychologyModel,
    Framework,
    SoftwarePackage,
    PsychologyDiscipline,
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

    return render(
        request,
        "psychology_models/psychologymodel_create.html",
        {
            "frameworks": frameworks,
            "software_packages": software_packages,
            "psychology_disciplines": psychology_disciplines,
        },
    )


def detail_view_dev(request):
    return render(
        request,
        "psychology_models/psychologymodel_detail_dev.html",
    )
