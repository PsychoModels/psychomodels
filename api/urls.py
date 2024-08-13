from django.urls import path
from .views import UserProfileViewSet

urlpatterns = [
    path(
        "user/profile/",
        UserProfileViewSet.as_view({"put": "update"}),
        name="user_profile_update",
    ),
]
