from django.contrib.auth.models import AbstractUser
from django.db import models
from django_countries.fields import CountryField


class User(AbstractUser):
    first_name = models.CharField(null=True, blank=True)
    last_name = models.CharField(null=True, blank=True)
    university = models.CharField(null=True, blank=True)
    department = models.CharField(null=True, blank=True)
    position = models.CharField(null=True, blank=True)
    country = CountryField(null=True, blank=True)

    def __str__(self):
        return self.email
