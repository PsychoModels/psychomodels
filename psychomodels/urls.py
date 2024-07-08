from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect

urlpatterns = [
    path("", include("static_pages.urls"), name="content_pages"),
    path("admin/", admin.site.urls, name="admin_page"),
    path("account/", include("allauth.urls")),
    path("markdownx/", include("markdownx.urls")),
    path("models/", include("psychology_models.urls"), name="psychomodels"),
    path("__reload__/", include("django_browser_reload.urls")),
    path("doi/", include("doi_lookup.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
