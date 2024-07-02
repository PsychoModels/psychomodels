from django.urls import re_path
from .views import lookup_doi

urlpatterns = [
    re_path(r"^lookup/(?P<doi>.+)/$", lookup_doi, name="lookup_doi"),
]
