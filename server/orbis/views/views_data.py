import jwt
import requests
from collections import OrderedDict
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from orbis.models import DataScope, generate_data_token, validate_data_token


class IsAuthenticatedOrAdmin(BasePermission):
    """
    A custom permission; any authenticated user can generate a token,
    but only the admin can consume a token.
    """

    def has_permission(self, request, view):
        user = request.user
        if request.method in SAFE_METHODS:
            return user.is_authenticated
        else:
            return user.is_superuser


# TokenView has no serializer for yasg to generate schemas from
# so I define some here just to make the swagger documentation useful


_encoded_token_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties=OrderedDict((
        ("token", openapi.Schema(type=openapi.TYPE_STRING)),
    ))
)


_decoded_token_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties=OrderedDict((
        ("iss", openapi.Schema(type=openapi.TYPE_STRING, example=get_current_site(None).domain)),
        ("sub", openapi.Schema(type=openapi.TYPE_STRING, example="user")),
        ("name", openapi.Schema(type=openapi.TYPE_STRING, example="orbis token")),
        ("iat", openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME)),
        ("exp", openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME)),
        ("scopes", openapi.Schema(type=openapi.TYPE_OBJECT, properties=OrderedDict((
            ("data", openapi.Schema(type=openapi.TYPE_OBJECT, properties=OrderedDict((
                ("read", openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING, example="authority/namespace/name/version"))),
                ("create", openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING, example="authority/namespace/name/version"))),
                ("delete", openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING, example="authority/namespace/name/version"))),
            )))),
        )))),
    )),
)


class TokenView(APIView):

    permission_classes = [IsAuthenticatedOrAdmin]

    @swagger_auto_schema(responses={status.HTTP_200_OK: _encoded_token_schema})
    def get(self, request, format=None):
        """
        Returns a JWT data token for the user
        """
        user = request.user
        token = generate_data_token(user)

        return Response({"token": token})

    @swagger_auto_schema(
        request_body=_encoded_token_schema,
        responses={status.HTTP_200_OK: _decoded_token_schema},
    )
    def post(self, request, format=None):
        """
        Returns a decoded JWT data token.
        Only intended for testing/development
        """
        token = request.data.get("token")

        try:
            # as implied by IsAuthenticatedOrAdmin, only the admin can validate a data token;
            # this is only used for testing/development, as the _real_ validation will be done via the data server
            payload = validate_data_token(token)
            return Response(payload)
        except Exception as e:
            raise APIException(e)


class DataView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):

        user = request.user
        data_token = generate_data_token(user)
        data_token_timeout = settings.DATA_TOKEN_TIMEOUT

        # # TODO: for now I am hard-coding things,
        # # TODO: once it's ready, I should proxy the request to the data-sources-directory service
        # # TODO: and get the sources from that response instead of creating them below
        # headers = f"Authentication: Bearer {token}"
        # response = requests.get(settings.DATA_SOURCES_DIRECTORY_URL, headers=headers)
        # if not status.is_success(response.status_code):
        #     raise APIException("Error retrieving data sources")
        # sources = response.json()

        sources = [
            {
                "label": "TropoSphere",
                "layers": [
                    {
                        "source_id": "astrosat/core/hospitals-uk/2019-12-17",
                        "authority": "astrosat",
                        "namespace": "core",
                        "name": "hospitals-uk",
                        "version": "2019-12-17",
                        "type": "geojson",  # vector|raster|geojson
                        "status": "published",  # draft|published|deprecated
                        "metadata": {
                            "label": "UK Hospitals",
                            "domain": "TropoSphere",
                            "range": True,
                            "description": "TropoSphere has name hospitals-uk with a label UK Hospitals Some paragraph describing stuff. TropoSphere has name hospitals-uk with a label UK Hospitals Some paragraph describing stuff.",
                            "url": f"{settings.DATA_URL}/astrosat/core/hospitals-uk/2019-12-17/hospitals_uk.geojson",
                        },
                    },
                    {
                        "source_id": "astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB",
                        "authority": "astrosat",
                        "namespace": "test",
                        "name": "sentinel-2-rgb",
                        "version": "S2A_20191223T034141_T47NPG_RGB",
                        "type": "raster",  # vector|raster
                        "status": "published",  # draft|published|deprecated
                        "metadata": {
                            "label": "Sentinel 2 RGB",
                            "domain": "TropoSphere",
                            "range": True,
                            "description": "TropoSphere has name sentinel-2-rgb with a label Sentinel 2 RGB Some paragraph describing stuff.",
                            "url": f"{settings.DATA_URL}/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{{z}}/{{x}}/{{y}}.png",
                        },
                    },
                ],
            },
            {
                "label": "Rice Paddies",
                "layers": [
                    {
                        "source_id": "astrosat/test/stoke-on-trent/v1",
                        "authority": "astrosat",
                        "namespace": "test",
                        "name": "stoke-on-trent",
                        "version": "v1",
                        "type": "vector",  # vector|raster
                        "status": "published",  # draft|published|deprecated
                        "metadata": {
                            "label": "Stoke-On-Trent",
                            "domain": "Rice Paddies",
                            "description": "Rice Paddies has name stoke-on-trent with a label Stoke-On-Trent Some paragraph describing stuff.",
                            "url": f"{settings.DATA_URL}/astrosat/test/stoke-on-trent/v1/metadata.json",
                        },
                    },
                    {
                        "source_id": "astrosat/test/super-sen2-japan-band5/dec-2019",
                        "authority": "astrosat",
                        "namespace": "test",
                        "name": "super-sen2-japan-band5",
                        "version": "dec-2019",
                        "type": "raster",  # vector|raster
                        "status": "published",  # draft|published|deprecated
                        "metadata": {
                            "label": "Japan Band5",
                            "domain": "Rice Paddies",
                            "description": "Rice Paddies has name super-sen2-japan-band5 with a label Japan Band5 Some paragraph describing stuff.",
                            "url": f"{settings.DATA_URL}/astrosat/test/super-sen2-japan-band5/dec-2019/{{z}}/{{x}}/{{y}}.png",
                        },
                    },
                ],
            },
        ]

        return Response({
            "token": data_token,
            "timeout": data_token_timeout,
            "sources": sources
        })
