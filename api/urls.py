from django.urls import path
from .views import (
    PsychologyModelViewSet,
    UserProfileViewSet,
    ContactViewSet,
    PsychologyModelDraftViewSet,
)

urlpatterns = [
    path(
        "psychology_models/",
        PsychologyModelViewSet.as_view({"post": "create"}),
        name="psychology_models_create",
    ),
    path(
        "psychology_models/draft/",
        PsychologyModelDraftViewSet.as_view({"get": "list", "post": "create"}),
        name="psychology_models_draft",
    ),
    path(
        "psychology_models/draft/<int:pk>/",
        PsychologyModelDraftViewSet.as_view({"get": "get", "put": "update", "delete": "delete"}),
        name="psychology_models_draft_detail",
    ),
    path(
        "user/profile/",
        UserProfileViewSet.as_view({"put": "update"}),
        name="user_profile_update",
    ),
    path(
        "contact/",
        ContactViewSet.as_view({"post": "create"}),
        name="" "contact_message_create",
    ),
]
