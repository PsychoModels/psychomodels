from django.urls import path
from .views import PsychologyModelViewSet, UserProfileViewSet

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
]
