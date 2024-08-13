from django.urls import path, re_path

from members import views

urlpatterns = [
    path("", views.account, name="members_account"),
    path("login/", views.account, name="members_login"),
    path("profile/", views.account, name="members_profile_edit"),
    path("change-password/", views.account, name="members_change_password"),
    path("password/reset/", views.account, name="members_password_reset"),
    re_path(r"^password/reset/.+", views.account, name="members_password_reset_key"),
    path("logout/", views.account, name="members_logout"),
    path("signup/", views.account, name="members_signup"),
    path("profile/", views.account, name="members_profile"),
    # do not add a catch-all route, other urls will be caught by allauth
]
