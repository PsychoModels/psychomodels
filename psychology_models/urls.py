from django.urls import path, re_path

from . import views


urlpatterns = [
    path("models/", views.psychology_model_search, name="model_search"),
    path("models/submission/", views.psychology_model_create, name="model_create"),
    re_path(
        r"^models/submission/.+",
        views.psychology_model_create,
        name="model_create_catch_all",
    ),
    path("models/my-models/", views.MyModelListView.as_view(), name="my_model_list"),
    re_path(
        r"^models/submission/.+",
        views.psychology_model_create,
        name="model_create_catch_all",
    ),
    path("models/<slug:slug>/", views.ModelDetailView.as_view(), name="model_view"),
    path("framework/", views.FrameworkListView.as_view(), name="framework_list"),
    path(
        "framework/<slug:slug>/",
        views.FrameworkDetailView.as_view(),
        name="framework_detail",
    ),
]
