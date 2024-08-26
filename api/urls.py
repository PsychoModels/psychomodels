from django.urls import path
from .views import PsychologyModelViewSet, UserProfileViewSet, ContactViewSet

urlpatterns = [
    path(
        "psychology_models/",
        PsychologyModelViewSet.as_view({"post": "create"}),
        name="psychology_models_create",
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
