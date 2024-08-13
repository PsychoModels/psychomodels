from rest_framework import viewsets, status
from rest_framework.response import Response

from api.serializers import UserProfileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer

    def update(self, request, pk=None):
        # Get the UserProfile instance associated with the currently logged-in user
        instance = request.user

        # Use the existing instance and the new data for updating
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
