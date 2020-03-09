import functools

from botocore.exceptions import BotoCoreError

from django.contrib.gis.geos import Polygon
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django_filters import rest_framework as filters

from rest_framework import mixins, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from orbis.adapters import SATELLITE_ADAPTER_REGISTRY
from orbis.models import Satellite, SatelliteSearch, SatelliteResult
from orbis.serializers import (
    SatelliteSerializer,
    SatelliteSearchSerializer,
    SatelliteResultSerializer,
)
from orbis.tests.test_satellites import (
    TEST_AOI_QUERY_PARAM,
    TEST_START_DATE,
    TEST_END_DATE,
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
            return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

    def get_queryset(self):

        if getattr(self, "swagger_fake_view", False):
            # queryset just for schema generation metadata
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return SatelliteSearch.objects.none()

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
    Allows me to filter results by satellite, tier, cloud_cover, or bounding_box
    usage is:
      <domain>/api/satellites/results/?satellites=a,b,c
      <domain>/api/satellites/results/?tiers=a,b,c
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

    satellites = CharInFilter(field_name="satellite__satellite_id")
    tiers = CharInFilter(field_name="tier__name")
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

    permission_classes = [IsAuthenticated]
    serializer_class = SatelliteResultSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = SatelliteResultFilterSet

    def get_queryset(self):

        if getattr(self, "swagger_fake_view", False):
            # queryset just for schema generation metadata
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return SatelliteResult.objects.none()

        user = self.request.user
        return user.satellite_results.all()


#####################
# satellite queries #
#####################


_satellite_query_params = [
    # (this re-uses some useful test values)
    openapi.Parameter("satellites", openapi.IN_QUERY, type=openapi.TYPE_STRING, default="sentinel-2"),
    openapi.Parameter("tiers", openapi.IN_QUERY, type=openapi.TYPE_STRING, default="free"),
    openapi.Parameter("start_date", openapi.IN_QUERY, type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, default=str(TEST_START_DATE)),
    openapi.Parameter("end_date", openapi.IN_QUERY, type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, default=str(TEST_END_DATE)),
    openapi.Parameter("aoi", openapi.IN_QUERY, type=openapi.TYPE_STRING, default=str(TEST_AOI_QUERY_PARAM)),
]


@swagger_auto_schema(
    method="get",
    manual_parameters=_satellite_query_params,
    responses={status.HTTP_200_OK: SatelliteResultSerializer(many=True)},
)
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def run_satellite_query(request):

    search_results = []

    # build a search out of the query_params
    # (and a bit of inference)...
    query_params = request.query_params.dict()
    query_params.update(
        {
            "name": "current-query",
            "owner": request.user.pk,
            "satellites": query_params["satellites"].split(","),
            "tiers": query_params["tiers"].split(","),
        }
    )
    search_serializer = SatelliteSearchSerializer(data=query_params)
    if not search_serializer.is_valid():
        raise APIException(search_serializer.errors)
    # (NOTE: django doesn't let you instanciate an unsaved model w/ m2m fields)
    # (so rather than try something hacky to use SatelliteSearch, I just carry on using SatelliteSearchSerializer)

    # send that search info to the adapter(s)...
    for satellite in search_serializer.validated_data["satellites"]:
        adapter = SATELLITE_ADAPTER_REGISTRY[satellite]
        adapter.setup(**search_serializer.validated_data, satellite=satellite)
        search_results += adapter.run_satellite_query()

    # return a list of results...
    results_serializer = SatelliteResultSerializer(search_results, many=True)
    return Response(results_serializer.data)