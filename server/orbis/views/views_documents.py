from django.http import FileResponse, HttpResponseNotFound

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.generics import RetrieveAPIView, ListAPIView, GenericAPIView
from rest_framework.permissions import BasePermission, IsAuthenticated

from django_filters import rest_framework as filters

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from astrosat.decorators import swagger_fake
from astrosat.views import BetterBooleanFilter

from orbis.models import Document, DocumentAgreement, DocumentType, Orb
from orbis.serializers import DocumentAgreementSerializer, DocumentSerializer

###########
# helpers #
###########


class NoMatchingDocumentException(APIException):
    status_code = 400
    default_detail = "Unable to find a matching document"
    default_code = "no_matching_document"


###########
# filters #
###########


class ChoiceInFilter(filters.BaseInFilter, filters.ChoiceFilter):
    # allows me to pass a list to the ChoiceFilter
    pass


class DefaultValueFilterSet(filters.FilterSet):
    # allows me to set default values for filters
    # as per https://django-filter.readthedocs.io/en/stable/guide/tips.html#using-initial-values-as-defaults

    def __init__(self, data=None, queryset=None, *, request=None, prefix=None):

        # if filterset is bound, use initial values as defaults
        if data is not None:
            # get a mutable copy of the QuerySet
            data = data.copy()

            for name, f in self.base_filters.items():
                initial = f.extra.get("initial")

                # filter param is either missing or empty, use initial as default
                if not data.get(name) and initial:
                    data[name] = initial

        super().__init__(
            data=data, queryset=queryset, request=request, prefix=prefix
        )


class DocumentAgreementFilterSet(DefaultValueFilterSet):
    class Meta:
        model = DocumentAgreement
        fields = ()

    is_active = BetterBooleanFilter(
        field_name="document__is_active",
        initial=True,
    )
    name = filters.CharFilter(
        field_name="document__name",
        lookup_expr="iexact",
    )
    type = ChoiceInFilter(
        field_name="document__type",
        choices=DocumentType.choices,
    )
    version = filters.CharFilter(
        field_name="document__version",
        lookup_expr="exact",
    )


class DocumentFilterSet(DefaultValueFilterSet):
    class Meta:
        model = Document
        fields = (
            "name",
            "version",
            "type",
            "is_active",
            "orb",
        )

    is_active = BetterBooleanFilter(initial=True)
    name = filters.CharFilter(lookup_expr="iexact")
    orb = filters.ModelChoiceFilter(
        queryset=Orb.objects.all(),
        to_field_name="name",
    )
    has_orb = filters.BooleanFilter(
        exclude=True,
        field_name="orb",
        lookup_expr="isnull",
    )


#########
# views #
#########


class DocumentAgreementListView(ListAPIView):
    """
    returns all documents that a user has agreed to
    """

    filter_backends = (filters.DjangoFilterBackend, )
    filterset_class = DocumentAgreementFilterSet
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentAgreementSerializer

    @swagger_fake(DocumentAgreement.objects.none())
    def get_queryset(self):
        current_user = self.request.user
        return current_user.agreements.all()


class DocumentDetailView(GenericAPIView):
    """
    returns a specific document
    """
    filter_backends = (filters.DjangoFilterBackend, )
    filterset_class = DocumentFilterSet

    permission_classes = []
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    @swagger_fake(None)
    def get_object(self):
        # DocumentDetailView uses filters to specify an object,
        # rather than the standard lookup_field/lookup_url_kwarg

        document_qs = self.filter_queryset(self.get_queryset())

        if document_qs.count() != 1:
            raise NoMatchingDocumentException
        document_obj = document_qs[0]

        self.check_object_permissions(self.request, document_obj)

        return document_obj

    @swagger_auto_schema(
        responses={status.HTTP_200_OK: "FileResponse"},
    )
    def get(self, request, *args, **kwargs):
        """
        returns the file associated w/ this document
        """
        try:
            document_obj = self.get_object()
        except NoMatchingDocumentException as e:
            return HttpResponseNotFound(e.detail)

        response = FileResponse(document_obj.file)

        # if the request came from swagger I ought to make the document downloadable;
        # swagger doesn't cope nicely w/ displaying content in another tab
        if "api/swagger" in request.headers.get("referer", ""):
            content_disposition = response.headers.get(
                "Content-Disposition", None
            )
            if content_disposition is not None:
                response.headers["Content-Disposition"] = content_disposition.replace(
                    "inline", "attachment"
                )  # yapf: disable

        return response
