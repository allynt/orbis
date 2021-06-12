from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from .models import ProxyDataSource

_geojson_schema = {
    "type": "FeatureCollection",
    "features": [
        {
            "id": 1,
            "geometry": {
                "type": "Point",
                "coordinates": [1, 2],
            },
            "properties": {
                "a": "b",
                "c": "d"
            }
        }
    ]
}  # yapf: disable

_source_id_params = [
    openapi.Parameter("authority", openapi.IN_PATH, required=True, type=openapi.TYPE_STRING),
    openapi.Parameter("namespace", openapi.IN_PATH, required=True, type=openapi.TYPE_STRING),
    openapi.Parameter("name", openapi.IN_PATH, required=True, type=openapi.TYPE_STRING),
    openapi.Parameter("version", openapi.IN_PATH, required=True, type=openapi.TYPE_STRING),
]  # yapf: disable

class ProxyDataSourceView(APIView):

    # permission_classes = []  # TODO: something like CanTokenAccessData

    @swagger_auto_schema(
        # manually defining swagger stuff b/c I don't use DRF serializers
        manual_parameters=_source_id_params,
        responses={
            status.HTTP_200_OK:
                openapi.Response(
                    "GeoJSON", examples={"application/json": _geojson_schema}
                )
        }
    )
    def post(self, request, **kwargs):
        proxy_data_source = get_object_or_404(
            ProxyDataSource.objects.active(), **self.kwargs
        )
        try:
            data = proxy_data_source.process_data(
                # TODO: UNCOMMENT THIS ONCE STUFF WORKS
                # proxy_data_source.get_data()
                proxy_data_source.adapter.SAMPLE_DATA
            )
            return Response(data)
        except Exception as e:
            raise APIException(e)
