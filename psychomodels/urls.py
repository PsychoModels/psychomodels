from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("", include("static_pages.urls"), name="static_pages"),
    path("admin/", admin.site.urls, name="admin_page"),
    path("account/", include("allauth.urls")),
    path("account/", include("members.urls"), name="members"),
    path("markdownx/", include("markdownx.urls")),
    path("models/", include("psychology_models.urls"), name="psychomodels"),
    path("__reload__/", include("django_browser_reload.urls")),
    path("doi/", include("doi_lookup.urls")),
]
