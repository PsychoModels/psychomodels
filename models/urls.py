from django.urls import path

from . import views

urlpatterns = [
    path("", views.IndexView.as_view(), name="models_overview"),
    path("models/<int:pk>/", views.ModelView.as_view(), name="model_view"),
    path("frameworks/", views.Frameworks.as_view(), name="frameworks"),
    path("models/<int:pk>/edit/", views.edit_model, name="edit_model"),
    path("frameworks/<int:pk>/", views.FrameworkView.as_view(), name="framework_view"),
    path("software/<int:pk>/", views.SoftwareView.as_view(), name="software_view"),
    path("submit", views.submit, name="model_submission"),
]
