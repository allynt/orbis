from collections import OrderedDict

from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.utils.functional import cached_property

from rest_framework import mixins, status, viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from astrosat.decorators import swagger_fake

from astrosat_users.models.models_customers import CustomerUser

from orbis.models import DataStorage

from satellites.models import SatelliteDataSource
from satellites.serializers import SatelliteDataSourceSerializer, SatelliteDataSourceCreateSerializer


_satellite_datasource_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties=OrderedDict((
        ("source_id", openapi.Schema(type=openapi.TYPE_STRING, example="some-random-unique-string")),
        ("created", openapi.Schema(type=openapi.TYPE_STRING, example="2000-01-01T12:00:00.000Z")),
        ("name", openapi.Schema(type=openapi.TYPE_STRING, example="a unique name")),
        ("description", openapi.Schema(type=openapi.TYPE_STRING, example="an optional description")),
        ("metadata", openapi.Schema(type=openapi.TYPE_OBJECT,
            properties=OrderedDict(),
            example={
                "label": "a unique name",
                "description": "an optional description",
                "domain": "My Data",
                "type": "raster",
                "url": "https://url/to/tiles/{{z}}/{{x}}/{{y}}",
                "application": {
                    "orbis": {
                        "layer": {},
                        "map_component": {},
                        "sidebar_component": {},
                        "categories": {"name": "Satellite Images"},
                        "orbs": [{
                            "name": "My Data",
                            "description": "Saved data for 'customer-user x'"
                        }]
                    }
                }
            }
        ))
    ))
)  # yapf: disable

_satellite_datasource_create_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties=OrderedDict((
        ("name", openapi.Schema(type=openapi.TYPE_STRING, example="test")),
        ("description", openapi.Schema(type=openapi.TYPE_STRING, example="test")),
        ("type", openapi.Schema(type=openapi.TYPE_STRING, example="raster")),
        ("satellite_id", openapi.Schema(type=openapi.TYPE_STRING, example="sentinel-2")),
        ("scene_id", openapi.Schema(type=openapi.TYPE_STRING, example="S2A_MSIL1C_20161207T105432_N0204_R051_T31UET_20161207T105428")),
        ("visualisation_id", openapi.Schema(type=openapi.TYPE_STRING, example="TCI")),
    ))
)  # yapf: disable

_satellite_datasource_update_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties=OrderedDict((
        ("name", openapi.Schema(type=openapi.TYPE_STRING, example="test")),
        ("description", openapi.Schema(type=openapi.TYPE_STRING, example="test")),
        ("type", openapi.Schema(type=openapi.TYPE_STRING, example="raster")),
    ))
)  # yapf: disable


class IsAdminOrOwner(BasePermission):
    """
    Only the admin or the owner of a SatelliteDataSource can access it
    """
    def has_permission(self, request, view):
        user = request.user
        return user.is_superuser or user == view.customer_user.user


@method_decorator(
    swagger_auto_schema(
        request_body=_satellite_datasource_create_request_schema,
        responses={status.HTTP_200_OK: _satellite_datasource_response_schema}
    ),
    name="create",
)
@method_decorator(
    swagger_auto_schema(
        responses={status.HTTP_200_OK: _satellite_datasource_response_schema}
    ),
    name="retrieve",
)
@method_decorator(
    swagger_auto_schema(
        request_body=_satellite_datasource_update_request_schema,
        responses={status.HTTP_200_OK: _satellite_datasource_response_schema}
    ),
    name="update",
)
@method_decorator(
    swagger_auto_schema(
        request_body=_satellite_datasource_update_request_schema,
        responses={status.HTTP_200_OK: _satellite_datasource_response_schema}
    ),
    name="partial_update",
)
class SatelliteDataSourceViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):

    lookup_url_kwarg = "datasource_id"
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    serializer_class = SatelliteDataSourceSerializer

    @cached_property
    def customer_user(self):
        return get_object_or_404(
            CustomerUser.objects.all(),
            customer__id=self.kwargs["customer_id"],
            user__uuid=self.kwargs["user_id"]
        )

    @swagger_fake(SatelliteDataSource.objects.none())
    def get_queryset(self):
        return SatelliteDataSource.objects.filter_by_user(
            self.customer_user.user
        )

    def get_serializer_class(self):
        if self.action == "create":
            return SatelliteDataSourceCreateSerializer
        return SatelliteDataSourceSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["customer_user"] = self.customer_user

        if self.action == 'create':
            storage = DataStorage(
                customer=self.customer_user.customer,
                user=self.customer_user.user,
                title=self.request.data['name'],
                size=SatelliteDataSource.DEFAULT_STORAGE_SIZE
            )
            storage.save()
            context["storage"] = storage

        # TODO: EVENTUALLY orbs & categories & type COULD COME FROM THE CLIENT
        context["orbs"] = [{
            "name": "My Data",
            "description": f"Saved data for user {self.customer_user.user}"
        }]
        context["categories"] = {"name": "Satellite Images"}
        context["type"] = SatelliteDataSource.TypeChoices.RASTER

        return context
