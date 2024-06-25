from django.urls import path

from . import views


urlpatterns = [
    path("", views.IndexView.as_view(), name="models_overview"),
    path("models/<int:pk>/", views.ModelView.as_view(), name="model_view"),
    path(
        "submission/start", views.submission_wizard_start, name="model_submission_start"
    ),
    path(
        "submission/account",
        views.CustomLoginView.as_view(),
        name="model_submission_account",
    ),
    path("submission/form", views.submission_wizard_form, name="model_submission_form"),
]
