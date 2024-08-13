from rest_framework import serializers

from members.models import User
from django_countries.serializers import CountryFieldMixin


class UserProfileSerializer(CountryFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "university",
            "department",
            "country",
        ]
