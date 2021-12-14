import functools
from collections import defaultdict
from botocore.exceptions import BotoCoreError

from django.contrib.gis.geos import Polygon
from django.http import JsonResponse
from django.utils.decorators import method_decorator

from django_filters import rest_framework as filters

from rest_framework import mixins, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response

from drf_yasg2.utils import swagger_auto_schema

from astrosat.decorators import swagger_fake

from orbis.models import Orb

from satellites.models import Satellite, SatelliteSearch, SatelliteResult
from satellites.serializers import (
    SatelliteSerializer,
    SatelliteSearchSerializer,
    SatelliteResultSerializer,
)

##############
# satellites #
##############


def check_storage_access(view_fn):
    """
    Gracefully fails if anything storage-related fails in the ViewSets below
    """
    @functools.wraps(view_fn)
    def check_storage_access_wrapper(request, *args, **kwargs):
        try:
            return view_fn(request, *args, **kwargs)
        except BotoCoreError as e:
            data = {"error": str(e)}
            return JsonResponse(
                data, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    return check_storage_access_wrapper


@method_decorator(check_storage_access, name="dispatch")
class SatelliteViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = SatelliteSerializer
    queryset = Satellite.objects.all()
    lookup_field = "satellite_id"


######################
# satellite searches #
######################


class SatelliteSearchViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    This viewset provides the "create" & "destroy" & "list" & "retrieve" actions,
    but not the "update" action.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = SatelliteSearchSerializer

    @swagger_fake(SatelliteSearch.objects.none())
    def get_queryset(self):
        user = self.request.user
        return user.satellite_searches.all()


#####################
# satellite results #
#####################


class CharInFilter(filters.BaseInFilter, filters.CharFilter):
    """
    Allows me to filter based on CharFields being in a list
    """

    pass


class SatelliteResultFilterSet(filters.FilterSet):
    """
    Allows me to filter results by satellite, cloud_cover, or bounding_box
    usage is:
      <domain>/api/satellites/results/?satellites=a,b,c
      <domain>/api/satellites/results/?cloudcover=n
      <domain>/api/satellites/results/?cloudcover__gte=n
      <domain>/api/satellites/results/?cloudcover__lte=n
      <domain>/api/satellites/results/?cloudcover__range=n
      <domain>/api/satellites/?footprint__bbox=-2.890854,52.683303,-1.13833,53.209580

    """
    class Meta:
        model = SatelliteResult
        fields = {
            # using automatic filter generation for "cloud_cover"
            "cloud_cover": ["exact", "gte", "lte", "range"],
            # but declarative filters for "satellites" & "footprint" below
        }

    satellites = CharInFilter(
        field_name="satellite__satellite_id", distinct=True
    )
    footprint__bbox = filters.Filter(method="filter_footprint_bbox")

    def filter_footprint_bbox(self, queryset, name, value):
        try:
            value = value.split(",")
            assert len(value) == 4
        except:
            msg = "Error specifying bounding_box filter"
            raise ValueError(msg)
        return queryset.filter(footprint__intersects=Polygon.from_bbox(value))


class SatelliteResultViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    This viewset provides the "create" & "destroy" & "list" & "retrieve" actions,
    but not the "update" action.
    """

    filter_backends = (filters.DjangoFilterBackend, )
    filterset_class = SatelliteResultFilterSet
    lookup_field = "scene_id"
    permission_classes = [IsAuthenticated]
    serializer_class = SatelliteResultSerializer

    @swagger_fake(SatelliteResult.objects.none())
    def get_queryset(self):
        user = self.request.user
        return user.satellite_results.all()


#####################
# satellite queries #
#####################


class CanQuerySatellitesPermission(BasePermission):
    """
    only a user w/ a licence to an orb w/ the "satellites" feature can call `run_satellite_query`
    """

    message = "You do not have a licence to run a Satellite Query."

    def has_permission(self, request, view):
        user = request.user

        user_orbs = Orb.objects.filter(
            is_active=True,
            licences__customer_user__in=user.customer_users.values_list(
                "pk", flat=True
            )
        ).distinct()

        user_satellite_orbs = user_orbs.filter(
            features__contains=["satellites"]
        )

        return user_satellite_orbs.exists()


@swagger_auto_schema(
    method="post",
    request_body=SatelliteSearchSerializer,
    responses={status.HTTP_200_OK: SatelliteResultSerializer(many=True)},
)
@api_view(["POST"])
@permission_classes([IsAuthenticated, CanQuerySatellitesPermission])
def run_satellite_query(request):

    errors = defaultdict(list)

    # build a search out of the request data...
    search_serializer = SatelliteSearchSerializer(data=request.data)
    search_serializer.is_valid(raise_exception=True)

    # use the adapter(s) to process that search...
    search_results = []
    for satellite in search_serializer.validated_data["satellites"]:
        try:
            search_results += satellite.adapter.run_query(
                satellite=satellite, **search_serializer.validated_data
            )
        except Exception as e:
            errors[str(satellite)].append(str(e))

    if errors:
        # fail gracefully...
        return Response(
            data={"errors": errors},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # or return a list of results...
    results_serializer = SatelliteResultSerializer(search_results, many=True)
    return Response(results_serializer.data)
