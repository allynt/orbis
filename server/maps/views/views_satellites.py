import functools

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django_filters import rest_framework as filters

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated

from botocore.exceptions import BotoCoreError

from maps.models import Satellite, SatelliteScene, SatelliteVisualisation
from maps.serializers import SatelliteSerializer, SatelliteSceneSerializer, SatelliteVisualisationSerializer


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



class SatelliteSceneFilterSet(filters.FilterSet):
    """
    Allows me to filter scenes by satellite
    usage is: <domain>/api/satellites/scenes/?satellites=a,b,c
    """

    class Meta:
        model = SatelliteScene
        fields = ("satellite",)

    satellites = filters.Filter(method="filter_satellites")

    def filter_satellites(self, queryset, name, value):
        return queryset.filter(
            satellite__satellite_id__in=value.split(",")
        )


class SatelliteViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = SatelliteSerializer
    queryset = Satellite.objects.all()


class SatelliteSceneViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = SatelliteSceneSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = SatelliteSceneFilterSet
    queryset = SatelliteScene.objects.select_related("satellite").all()


@method_decorator(check_storage_access, name="dispatch")
class SatelliteVisualisationViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = SatelliteVisualisationSerializer
    queryset = SatelliteVisualisation.objects.all()
