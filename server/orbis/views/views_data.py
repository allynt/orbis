import jwt
import requests
from collections import OrderedDict, defaultdict
from datetime import datetime, timedelta
from functools import reduce
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

from orbis.models import DataScope, Orb
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


# Neither TokenView nor DataSourceView have serializers for yasg to generate
# schemas, so I define some here just to make the swagger documentation useful

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
    ))
)


_data_sources_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties=OrderedDict((
        ("token", openapi.Schema(type=openapi.TYPE_STRING)),
        ("timeout", openapi.Schema(type=openapi.TYPE_NUMBER, example=60)),
        ("sources", openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties=OrderedDict((
                ("source_id", openapi.Schema(type=openapi.TYPE_STRING, example="astrosat/core/infrastructure/2020")),
                ("authority", openapi.Schema(type=openapi.TYPE_STRING, example="astrosat")),
                ("namespace", openapi.Schema(type=openapi.TYPE_STRING, example="core")),
                ("name", openapi.Schema(type=openapi.TYPE_STRING, example="infrastructure")),
                ("version", openapi.Schema(type=openapi.TYPE_STRING, example="2020")),
                ("type", openapi.Schema(type=openapi.TYPE_STRING, example="vector")),
                ("status", openapi.Schema(type=openapi.TYPE_STRING, example="published")),
                ("orbs", openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties=OrderedDict((
                        ("name", openapi.Schema(type=openapi.TYPE_STRING)),
                        ("description", openapi.Schema(type=openapi.TYPE_STRING)),
                    ))
                ))),
                ("metadata", openapi.Schema(type=openapi.TYPE_OBJECT)),
            ))
        ))),
    ))
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


class DataSourceView(APIView):
    """
    Generates a JWT for the current user and passes it to data-sources-directory
    in order to retrieve a list of DataSources the user can access; Adds information
    about the JWT itself as well as which Orbs each DataSource belongs to to the response.
    """

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={status.HTTP_200_OK: _data_sources_schema})
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
            raise APIException(f"Unable to retrieve data sources at '{url}': {str(e)}")
        sources = response.json()["results"]

        # TODO: CAN THIS BE MADE MORE EFFICIENT BY MAKING A LOOKUP TABLE AND LOOPING THROUGH THAT
        # TODO: INSTEAD OF A SEPARATE QUERY EACH ITERATION OF THE LOOP?

        # data_scopes = DataScope.objects.filter(
        #     is_active=True, orbs__licences__in=user.customer_users.values("licences")
        # ).prefetch_related("orbs")
        # for source in sources:
        #     matching_data_scopes = data_scopes.matches_source_id(source["source_id"])
        #     source["orbs"] = [
        #         dict(zip(["name", "description"], matching_orb_dict.values()))
        #         for matching_orb_dict in matching_data_scopes.values("orbs__name", "orbs__description")
        #     ]

        # TODO: YES IT CAN, BUT IT'S NOT VERY PRETTY

        orbs = Orb.objects.filter(
            licences__customer_user__in=user.customer_users.values_list("pk", flat=True)
        ).prefetch_related("data_scopes")
        data_scopes_to_orb_mapping = defaultdict(list)
        for orb in orbs:
            for data_scope in orb.data_scopes.all():
                data_scopes_to_orb_mapping[data_scope.source_id_pattern] += [
                    {"name": orb.name, "description": orb.description}
                ]

        for source in sources:
            matching_orbs = dict(filter(
                lambda item: DataScope.matches_source_id(item[0], source["source_id"]),
                data_scopes_to_orb_mapping.items()
            )).values()
            source["orbs"] = reduce(lambda orb1, orb2: orb1 + orb2, matching_orbs)

        return Response({
            "token": data_token,
            "timeout": data_token_timeout,
            "sources": sources,
        })
