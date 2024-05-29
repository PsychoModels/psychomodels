from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="models_index"),
    path("about/", views.about, name="models_about"),
    path("tutorial/", views.tutorial, name="models_tutorial"),
    path("contact", views.contact, name="contact_page"),
]
