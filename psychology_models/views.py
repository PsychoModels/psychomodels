from typing import Any, Dict

from django.http import HttpResponse
from django.views import generic
from django.template import loader

from allauth.account.views import LoginView

from psychology_models.models import PsychologyModel, Framework, ProgrammingLanguage


class IndexView(generic.ListView):
    queryset = PsychologyModel.objects.filter()
    template_name = "models/model_overview.html"
    context_object_name = "models_list"

    def get_queryset(self, *args, **kwargs):
        queryset = super().get_queryset(*args, **kwargs)

        # Filter by search
        # self.searchset = PsychmodelSearch(self.request.GET, queryset=queryset)
        # queryset = self.searchset.qs
        #
        # # Filter by filters
        # self.filterset = PsychmodelFilter(self.request.GET, queryset=queryset)
        # queryset = self.filterset.qs

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["search_form"] = self.searchset.form
        context["filter_form"] = self.filterset.form
        return context


class ModelView(generic.DetailView):
    model = PsychologyModel
    template_name = "models/model_view.html"

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        return super().get_context_data(**kwargs)


def submission_wizard_start(request):
    template = loader.get_template("submission_wizard.html")
    context = {"section": "SUBMISSION_GUIDELINES"}
    return HttpResponse(template.render(context, request))


class CustomLoginView(LoginView):
    template_name = "submission_wizard.html"  # Your custom template
    extra_context = {"section": "ACCOUNT"}

    def get_success_url(self):
        return "form"


def submission_wizard_account(request):
    template = loader.get_template("submission_wizard.html")
    context = {"section": "ACCOUNT"}
    return HttpResponse(template.render(context, request))


def submission_wizard_form(request):
    template = loader.get_template("submission_wizard.html")
    context = {
        "section": "FORM",
        "frameworks": Framework.objects.all(),
        "programmingLanguages": ProgrammingLanguage.objects.all(),
    }
    return HttpResponse(template.render(context, request))
