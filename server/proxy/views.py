import json
from copy import deepcopy

from django.core.cache import cache, caches
from django.shortcuts import get_object_or_404
from django.urls import resolve

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

# this class performs JWT authentication w/out a local user, as per:
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/experimental_features.html
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from .models import ProxyDataSource
from .pagination import LocalPagination
from .permissions import CanTokenAccessData

PROXY_CACHE = caches["default"]


_paginated_geojson_schema = {
    "type": "FeatureCollection",
    "count": 1000,
    "pages": 100,
    "previous": "https://some.url.com/?page=2",
    "next": "https://some.url.com/?page=3",
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


auto_schema_kwargs = {
    "manual_parameters": [
        openapi.Parameter("authority", openapi.IN_PATH, required=True, type=openapi.TYPE_STRING),
        openapi.Parameter("namespace", openapi.IN_PATH, required=True, type=openapi.TYPE_STRING),
        openapi.Parameter("name", openapi.IN_PATH, required=True, type=openapi.TYPE_STRING),
        openapi.Parameter("version", openapi.IN_PATH, required=True, type=openapi.TYPE_STRING),
        openapi.Parameter("page", openapi.IN_QUERY, required=False, type=openapi.TYPE_INTEGER),
        openapi.Parameter("page_size", openapi.IN_QUERY, required=False, type=openapi.TYPE_INTEGER),
    ],
    "responses": {
        status.HTTP_200_OK:
            openapi.Response(
                "GeoJSON",
                examples={"application/json": _paginated_geojson_schema}
            )
    },
}  # yapf: disable,

class ProxyDataSourceView(APIView):

    authentication_classes = [JWTTokenUserAuthentication]

    pagination_class = LocalPagination

    permission_classes = [
        IsAuthenticated,
        CanTokenAccessData(
            lambda request: "{authority}/{namespace}/{name}/{version}".
            format(**resolve(request.path).kwargs),
            verb="read",
        )
    ]

    def run(self, request: Request, **kwargs):

        proxy_data_source = get_object_or_404(
            ProxyDataSource.objects.active(), **self.kwargs
        )
        proxy_data_source.request = request

        try:

            cache_key = "-".join(self.kwargs.values())
            processed_data = PROXY_CACHE.get(cache_key)
            if not processed_data:
                processed_data = proxy_data_source.process_data(
                    proxy_data_source.get_data(
                        request_query_params=request.query_params,
                        request_body_data=request.data
                    )
                )
                PROXY_CACHE.set(
                    cache_key,
                    processed_data,
                    timeout=proxy_data_source.timeout,
                )  # default timeout is "0" - which means "don't cache"

            if proxy_data_source.local_pagination:
                paginator = self.pagination_class()
                page = paginator.paginate(processed_data, request)
                return paginator.get_paginated_response(page)
            else:
                return Response(processed_data)

        except Exception as e:
            breakpoint()
            raise APIException(e)

    @swagger_auto_schema(**auto_schema_kwargs)
    def get(self, request: Request, **kwargs):
        return self.run(request, **kwargs)

    @swagger_auto_schema(**auto_schema_kwargs)
    def post(self, request: Request, **kwargs):
        return self.run(request, **kwargs)
