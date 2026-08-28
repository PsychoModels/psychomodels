from django.urls import path

from . import views


urlpatterns = [
    path("", views.theory_search, name="theory_search"),
    path("<slug:slug>/", views.TheoryDetailView.as_view(), name="theory_view"),
]
