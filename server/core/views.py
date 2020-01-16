from django.conf import settings
from django.views.generic import TemplateView

from rest_framework.response import Response
from rest_framework.views import APIView

from astrosat_users.conf import app_settings as astrosat_users_settings


###############################
# the one-and-only index_view #
###############################

# this 'index.html' comes from CLIENT_DIR
index_view = TemplateView.as_view(template_name="index.html")


###############
# config view #
###############


class AppConfigView(APIView):
    def get(self, request, format=None):

        config = {
            "trackingId": settings.TRACKING_ID,
            "mapbox_token": settings.MAPBOX_TOKEN,  # TODO: SHOUDN'T THIS BE "mapboxToken" FOR CONSISTENCY ?
            "passwordMinLength": astrosat_users_settings.PASSWORD_MIN_LENGTH,
            "passwordMaxLength": astrosat_users_settings.PASSWORD_MAX_LENGTH,
            "passwordStrength": astrosat_users_settings.PASSWORD_STRENGTH,
            "isRegistrationOpen": astrosat_users_settings.ASTROSAT_USERS_ALLOW_REGISTRATION,
            "isVerificationRequired": astrosat_users_settings.ASTROSAT_USERS_REQUIRE_VERIFICATION,
            "isApprovalRequired": astrosat_users_settings.ASTROSAT_USERS_REQUIRE_APPROVAL,
        }

        return Response(config)


app_config_view = AppConfigView.as_view()
