import jwt
import requests
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView

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


class TokenView(APIView):

    permission_classes = [IsAuthenticatedOrAdmin]

    def get(self, request, format=None):

        user = request.user
        token = generate_data_token(user)

        return Response({"token": token})

    def post(self, request, format=None):

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

        sources = []
        for source_id, source_label in [
            ("astrosat/core/hospitals-uk/2019-12-17", "Hospitals in the UK"),
            ("astrosat/core/hospitals-vn/2019-12-17", "Hospitals in Vietname"),
        ]:
            authority, namespace, name, version = source_id.split("/")
            sources.append(
                {
                    "source_id": source_id,
                    "authority": authority,
                    "namespace": namespace,
                    "name": name,
                    "version": version,
                    "kind": "vector",  # vector|raster
                    "status": "published",  # draft|published|deprecated
                    "metadata": {
                        "label": source_label,
                        "url": f"{settings.DATA_URL}/{source_id}",
                    },
                }
            )

        return Response({
            "token": data_token,
            "timeout": data_token_timeout,
            "sources": sources
        })
