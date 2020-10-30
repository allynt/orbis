import jwt
import requests
from collections import OrderedDict
from datetime import datetime, timedelta
from urllib.parse import urljoin

from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView

from requests.exceptions import Timeout

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from orbis.models import DataScope
from orbis.utils import generate_data_token, validate_data_token


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
        ("iss", openapi.Schema(type=openapi.TYPE_STRING, example="domain.com")),
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

        url = urljoin(settings.DATA_SOURCES_DIRECTORY_URL, "/api/data-sources/v1/")
        headers = {
            "Authorization": f"Bearer {data_token.decode('utf-8')}"
        }

        try:
            response = requests.get(url, headers=headers, timeout=2.5)
            if not status.is_success(response.status_code):
                raise APIException("Error retrieving data sources")
        except Timeout as e:
            raise APIException(f"Request {url} timed out, exception was: {str(e)}")
        except Exception as e:
            # TODO: REMOVE THIS TRY/CATCH BLOCK ONCE I'M SURE THINGS ARE WORKING
            raise APIException(f"Unable to retrieve data sources at '{url}': {str(e)}")
        sources = response.json()["results"]

        return Response({
            "token": data_token,
            "timeout": data_token_timeout,
            "sources": sources
        })
