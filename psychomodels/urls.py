from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("", include("static_pages.urls"), name="static_pages"),
    path("admin/", admin.site.urls, name="admin_page"),
    path("models/", include("psychology_models.urls"), name="psychomodels"),
    path("account/", include("members.urls"), name="members"),
    path("account/", include("allauth.urls")),
    path("doi/", include("doi_lookup.urls")),
    path("api/", include("api.urls")),
    path("markdownx/", include("markdownx.urls")),
    path("_allauth/", include("allauth.headless.urls")),
    path("__reload__/", include("django_browser_reload.urls")),
]
