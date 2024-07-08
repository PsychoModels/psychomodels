from django.urls import path

from . import views


urlpatterns = [
    path("", views.PsychologyModelListView.as_view(), name="models_list"),
    path("<int:pk>/", views.ModelDetailView.as_view(), name="models_detail"),
]
