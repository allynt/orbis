from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils.functional import cached_property

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, BasePermission

from orbis.models import OrbisUserFeedbackRecord
from orbis.serializers import OrbisUserFeedbackRecordSerializer


class IsAdminOrSelf(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.is_superuser or user == view.user


class OrbisUserFeedbackRecordView(generics.CreateAPIView):

    permission_classes = [IsAuthenticated, IsAdminOrSelf]
    serializer_class = OrbisUserFeedbackRecordSerializer

    @cached_property
    def user(self):
        user_id = self.kwargs["id"]
        user = get_object_or_404(get_user_model(), uuid=user_id)
        return user

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if getattr(self, "swagger_fake_view", False):
            context["profile"] = None
        else:
            context["profile"] = self.user.orbis_profile
        return context

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return OrbisUserFeedbackRecord.objects.none()
        return self.user.orbis_profile.feedback_records.all()
