import requests
from requests.exceptions import Timeout

from collections import OrderedDict, defaultdict
from itertools import chain
from functools import reduce
from urllib.parse import urljoin

from django.conf import settings
from django.db.models import Prefetch

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from orbis.models import DataScope, Orb
from orbis.serializers import StoredDataSourceSerializer
from orbis.utils import (
    chunk_data_scopes,
    generate_data_scopes,
    generate_data_token,
    validate_data_token,
)


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
)  # yapf: disable


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
)  # yapf: disable

_data_sources_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties=OrderedDict((
        ("tokens", openapi.Schema(type=openapi.TYPE_OBJECT, properties=OrderedDict((
            ("scope_id", openapi.Schema(type=openapi.TYPE_STRING, example="<jwt>")),
        )))),
        ("timeout", openapi.Schema(type=openapi.TYPE_NUMBER, example=60)),
        ("sources", openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT, properties=OrderedDict((
            ("source_id", openapi.Schema(type=openapi.TYPE_STRING, example="astrosat/core/infrastructure/2020")),
            ("authority", openapi.Schema(type=openapi.TYPE_STRING, example="astrosat")),
            ("namespace", openapi.Schema(type=openapi.TYPE_STRING, example="core")),
            ("name", openapi.Schema(type=openapi.TYPE_STRING, example="infrastructure")),
            ("version", openapi.Schema(type=openapi.TYPE_STRING, example="2020")),
            ("type", openapi.Schema(type=openapi.TYPE_STRING, example="vector")),
            ("status", openapi.Schema(type=openapi.TYPE_STRING, example="published")),
            ("orbs", openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT, properties=OrderedDict((
                ("name", openapi.Schema(type=openapi.TYPE_STRING)),
                ("description", openapi.Schema(type=openapi.TYPE_STRING)),
            ))))),
            ("metadata", openapi.Schema(type=openapi.TYPE_OBJECT)),
        ))))),
    ))
)  # yapf: disable


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

    CHUNK_SIZE = 60

    permission_classes = [IsAuthenticated]

    @classmethod
    def reshape_data_tokens(cls, user, data_scopes):
        """
        Rather than return a single JWT for every data_scope,
        returns a dictionary of separate JWTs for each data_scope.
        """
        verb, scope_ids = zip(*data_scopes.items())
        return {
            scope_id: generate_data_token(
                user,
                data_scopes={
                    k: [scope_id] if scope_id in v else []
                    for k, v in zip(verb, scope_ids)
                }
            )
            for scope_id in set(chain.from_iterable(scope_ids))
        }  # yapf: disable

    @swagger_auto_schema(responses={status.HTTP_200_OK: _data_sources_schema})
    def get(self, request, format=None):
        """
        Makes a request to the `data-sources-directory` URL
        to get the set of `DataSources` the user can access.
        Also adds any local `StoredDataSources` to that set.
        """

        user = request.user
        url = urljoin(
            settings.DATA_SOURCES_DIRECTORY_URL, "/api/data-sources/v1/"
        )

        data_token_timeout = settings.DATA_TOKEN_TIMEOUT
        data_scopes = generate_data_scopes(user)
        duplicated_data_sources_ids = set()
        data_sources = []

        # chunk the data_scopes to reduce the size of the request.header sent to `data-sources-directory`
        for chunked_data_scopes in chunk_data_scopes(
            data_scopes, chunk_size=self.CHUNK_SIZE
        ):
            data_token = generate_data_token(user, chunked_data_scopes)
            headers = {"Authorization": f"Bearer {data_token}"}
            try:
                response = requests.get(
                    url,
                    headers=headers,
                    timeout=2.5,
                    proxies={
                        "http": settings.REQUESTS_PROXY,
                        "https": settings.REQUESTS_PROXY,
                    } if settings.REQUESTS_PROXY else None
                )
                if not status.is_success(response.status_code):
                    raise APIException("Error retrieving data sources")
            except Timeout as e:
                raise APIException(
                    f"Request {url} timed out, exception was: {str(e)}"
                )
            except Exception as e:
                raise APIException(
                    f"Unable to retrieve data sources at '{url}': {str(e)}"
                )

            # b/c I am chunking these responses I could wind up w/ duplicate data_sources, so
            # I filter data_sources_results by duplicated_data_sources_ids from previous iterations
            data_sources_results = response.json()["results"]
            data_sources += filter(
                lambda data_source: data_source["source_id"] not in
                duplicated_data_sources_ids,
                data_sources_results
            )
            duplicated_data_sources_ids.update([
                data_source["source_id"] for data_source in data_sources_results
            ])

        # find all active orbs that this user has a licence to...
        orbs = Orb.objects.filter(
            is_active=True,
            licences__customer_user__in=user.customer_users.values_list(
                "pk", flat=True
            )
        ).prefetch_related(
            Prefetch(
                "data_scopes",
                queryset=DataScope.objects.filter(is_active=True),
                to_attr="filtered_data_scopes"
            )
        ).distinct()
        # create a mapping from data_scopes to those orbs...
        data_scopes_to_orb_mapping = defaultdict(list)
        for orb in orbs:
            for data_scope in orb.filtered_data_scopes:
                data_scopes_to_orb_mapping[data_scope.source_id_pattern] += [{
                    "name": orb.name, "description": orb.description
                }]

        for source in data_sources:
            # find all of the above orbs w/ a data_scope that matches the source_id...
            matching_orbs = dict(
                filter(
                    lambda item: DataScope.
                    matches_source_id(item[0], source["source_id"]),
                    data_scopes_to_orb_mapping.items()
                )
            ).values()

            # add them all as a single list (inserting missing metadata elements as needed)...
            source_orbis_metadata = source
            for key in ["metadata", "application", "orbis"]:
                source_orbis_metadata = source_orbis_metadata.setdefault(
                    key, {}
                )
            source_orbis_metadata["orbs"] = reduce(
                lambda orb1, orb2: orb1 + orb2, matching_orbs
            )

        # add StoredDataSources to the sources...
        stored_data_sources = [
            storage.data_source
            for storage in user.storage.active().has_data_source()
        ]
        stored_data_source_serializer = StoredDataSourceSerializer(
            stored_data_sources, many=True
        )
        data_sources += stored_data_source_serializer.data

        return Response({
            "tokens": self.reshape_data_tokens(
                user,
                data_scopes,
            ),
            "timeout": data_token_timeout,
            "sources": data_sources,
        })
