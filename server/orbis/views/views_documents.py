from django.http import FileResponse

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.generics import GenericAPIView

from django_filters import rest_framework as filters

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from astrosat.views import BetterBooleanFilter

from orbis.models import TermsDocument, PrivacyDocument


class NoMatchingDocumentException(APIException):
    status_code = 400
    default_detail = "Unable to find a matching document"
    default_code = "no_matching_document"


class DocumentView(GenericAPIView):

    _document_view_parameters = [
        openapi.Parameter(
            "version", openapi.IN_QUERY, type=openapi.TYPE_STRING
        ),
        openapi.Parameter(
            "is_active", openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN
        ),
    ]

    def get_queryset(self):
        """
        Dynamically figures out which document type should be returned
        """
        document_type = self.kwargs.get("document_type").lower()
        if document_type == "terms":
            return TermsDocument.objects.all()
        elif document_type == "privacy":
            return PrivacyDocument.objects.all()
        raise NoMatchingDocumentException

    def get_object(self):
        """
        uses the filter parameters to select a single document from the queryset
        """
        document_qs = self.get_queryset()

        document_version_filter = filters.CharFilter(field_name="version")
        document_is_active_filter = BetterBooleanFilter(field_name="is_active")

        document_qs = document_version_filter.filter(
            document_qs, self.request.query_params.get("version", None)
        )
        document_qs = document_is_active_filter.filter(
            document_qs, self.request.query_params.get("is_active", True)
        )

        if document_qs.count() != 1:
            raise NoMatchingDocumentException

        return document_qs[0]

    @swagger_auto_schema(
        manual_parameters=_document_view_parameters,
        responses={status.HTTP_200_OK: "FileResponse"},
    )
    def get(self, request, document_type):

        document_obj = self.get_object()

        return FileResponse(document_obj.file)
