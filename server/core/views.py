from collections import OrderedDict

from django.conf import settings

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema

from astrosat_users.conf import app_settings as astrosat_users_settings

from orbis.models import GeometrySet

###############
# config view #
###############


class AppConfigView(APIView):

    # yapf: disable

    # AppConfigView has no serializer to generate a swagger schema from
    # so I define one here just to make the generated documentation work
    _config_schema = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties=OrderedDict((
            ("trackingId", openapi.Schema(type=openapi.TYPE_STRING)),
            ("mapbox_token", openapi.Schema(type=openapi.TYPE_STRING)),
            ("passwordMinLength", openapi.Schema(type=openapi.TYPE_INTEGER)),
            ("passwordMaxLength", openapi.Schema(type=openapi.TYPE_INTEGER)),
            ("isRegistrationOpen", openapi.Schema(type=openapi.TYPE_BOOLEAN)),
            ("isVerificationRequired", openapi.Schema(type=openapi.TYPE_BOOLEAN)),
            ("isApprovalRequired", openapi.Schema(type=openapi.TYPE_BOOLEAN)),
            ("mapStyles", openapi.Schema(type=openapi.TYPE_STRING, example="[{'id': 'streets', 'uri': 'mapbox://styles/mapbox/streets-v11', 'title': 'Streets'}]")),
            ("maximumAoiArea", openapi.Schema(type=openapi.TYPE_INTEGER, example=500)),
            ("dataIndexUrl", openapi.Schema(type=openapi.TYPE_STRING)),
            ("commitSha", openapi.Schema(type=openapi.TYPE_STRING)),
            ("geometrySet", openapi.Schema(type=openapi.TYPE_OBJECT, properties=OrderedDict((
                    ("name", openapi.Schema(type=openapi.TYPE_STRING)),
                    ("order", openapi.Schema(type=openapi.TYPE_INTEGER)),
                ))
            )),
            ("dataIndexUrl", openapi.Schema(type=openapi.TYPE_STRING)),
        ))
    )

    @swagger_auto_schema(responses={status.HTTP_200_OK: _config_schema})
    def get(self, request, format=None):
        """
        Returns some information required by the client for initial configuration
        """

        config = {
            "trackingId": settings.TRACKING_ID,
            "mapbox_token": settings.MAPBOX_TOKEN,  # TODO: SHOUDN'T THIS BE "mapboxToken" FOR CONSISTENCY ?
            "passwordMinLength": astrosat_users_settings.PASSWORD_MIN_LENGTH,
            "passwordMaxLength": astrosat_users_settings.PASSWORD_MAX_LENGTH,
            "passwordStrength": astrosat_users_settings.PASSWORD_STRENGTH,
            "isRegistrationOpen": astrosat_users_settings.ASTROSAT_USERS_ALLOW_REGISTRATION,
            "isVerificationRequired": astrosat_users_settings.ASTROSAT_USERS_REQUIRE_VERIFICATION,
            "isApprovalRequired": astrosat_users_settings.ASTROSAT_USERS_REQUIRE_APPROVAL,
            "mapStyles": settings.MAPBOX_STYLES,
            "maximumAoiArea": settings.MAXIMUM_AOI_AREA,
            "commitSha": settings.COMMIT_SHA,
            "dataIndexUrl": settings.DATA_INDEX_URL,
            "userTrackingInterval": settings.USER_TRACKING_INTERVAL,
            "geometrySet": {type.name: type.order for type in GeometrySet.objects.all()},
            "dataIndexUrl": settings.DATA_INDEX_URL,
        }

        return Response(config)


app_config_view = AppConfigView.as_view()
