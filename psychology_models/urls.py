from django.urls import path

from . import views


urlpatterns = [
    path("", views.psychology_model_search, name="model_search"),
    path("submission/", views.psychology_model_create, name="model_create"),
    path("detail_view_dev", views.detail_view_dev, name="model_detail_view_dev"),
    path("<slug:slug>/", views.ModelDetailView.as_view(), name="model_detail"),
]
