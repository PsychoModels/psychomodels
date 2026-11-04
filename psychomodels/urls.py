from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import include, path
from markdownx.views import ImageUploadView, MarkdownifyView

urlpatterns = [
    path("", include("static_pages.urls"), name="static_pages"),
    path("", include("psychology_models.urls"), name="psychomodels"),
    path("admin/", admin.site.urls, name="admin_page"),
    path("account/", include("members.urls"), name="members"),
    path("account/", include("allauth.urls")),
    path("doi/", include("doi_lookup.urls")),
    path("api/", include("api.urls")),
    # markdownx ships its routes without authentication. The upload view hands
    # user-supplied files to Pillow, so both routes are restricted to logged-in
    # users. Route names are kept so the markdownx widget keeps working.
    path(
        "markdownx/upload/",
        login_required(ImageUploadView.as_view()),
        name="markdownx_upload",
    ),
    path(
        "markdownx/markdownify/",
        login_required(MarkdownifyView.as_view()),
        name="markdownx_markdownify",
    ),
    path("_allauth/", include("allauth.headless.urls")),
    path("__reload__/", include("django_browser_reload.urls")),
]
