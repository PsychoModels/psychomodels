from rest_framework import viewsets, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from contact.email import send_contact_notification, send_contact_confirmation
from psychology_models.email import (
    send_submission_notification,
    send_submission_confirmation,
)
from psychology_models.models import PsychologyModel, Framework, PsychologyModelDraft
from psychology_models.utils.get_doi_citations import get_doi_citations

from .serializers import (
    PsychologyModelSerializer,
    UserProfileSerializer,
    ContactSerializer,
    PsychologyModelDraftSerializer,
)


class PsychologyModelViewSet(viewsets.ViewSet):
    serializer_class = PsychologyModelSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()

            # fetch all the doi publication meta data for the psychology model and newly created frameworks
            queryset = PsychologyModel.objects.filter(pk=instance.pk)
            get_doi_citations.after_response(queryset, refetch=False)

            frameworks_queryset = Framework.objects.filter(
                psychologymodel__pk=instance.pk
            )
            get_doi_citations.after_response(frameworks_queryset, refetch=False)

            send_submission_notification.after_response(psychology_model=instance)
            send_submission_confirmation.after_response(psychology_model=instance)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class ContactViewSet(viewsets.ViewSet):
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            contact_message = serializer.save()
            send_contact_notification(contact_message)
            send_contact_confirmation(contact_message)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PsychologyModelDraftViewSet(viewsets.ViewSet):
    serializer_class = PsychologyModelDraftSerializer

    def list(self, request):
        queryset = PsychologyModelDraft.objects.filter(created_by=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, pk=None):
        instance = get_object_or_404(
            PsychologyModelDraft, pk=pk, created_by=request.user
        )
        serializer = self.serializer_class(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        instance = get_object_or_404(PsychologyModelDraft, pk=pk)
        if instance.created_by != request.user:
            raise PermissionDenied("You do not have permission to edit this draft.")
        serializer = self.serializer_class(instance, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        instance = get_object_or_404(PsychologyModelDraft, pk=pk)
        if instance.created_by != request.user:
            raise PermissionDenied("You do not have permission to delete this draft.")
        instance.delete()
        return Response(
            {"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )
