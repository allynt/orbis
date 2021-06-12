from django.shortcuts import get_object_or_404
from django.urls import resolve

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# this class performs JWT authentication w/out a local user, as per:
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/experimental_features.html
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from .models import ProxyDataSource
from .permissions import CanTokenAccessData

_geojson_schema = {
    "type": "FeatureCollection",
    "features": [
        {
            "id": 1,
            "geometry": {
                "type": "Point",
                "coordinates": [55.95, -3.19],
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

    authentication_classes = [JWTTokenUserAuthentication]

    permission_classes = [
        IsAuthenticated,
        CanTokenAccessData(
            lambda request: "{authority}/{namespace}/{name}/{version}".
            format(**resolve(request.path).kwargs),
            verb="read",
        )
    ]

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
    def get(self, request, **kwargs):
        proxy_data_source = get_object_or_404(
            ProxyDataSource.objects.active(), **self.kwargs
        )
        try:
            data = proxy_data_source.process_data(
                # TODO: UNCOMMENT THIS ONCE STUFF IS LIVE
                # proxy_data_source.get_data()
                proxy_data_source.adapter.SAMPLE_DATA
            )
            return Response(data)
        except Exception as e:
            raise APIException(e)
