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


# TODO: all code below here should probably be moved to django-astrosat-core


from django_filters import rest_framework as filters

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, SAFE_METHODS

from .models import Bookmark
from .serializers import BookmarkGeoSerializer


class IsAdminOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        # anybody can do GET, HEAD, or OPTIONS
        if request.method in SAFE_METHODS:
            return True

        # only the admin or the specific owner can do POST, PUT, PATCH, DELETE
        user = request.user
        return user.is_superuser or user == obj.owner


class BookmarkFilterSet(filters.FilterSet):
    """
    Allows me to filter bookmarks by owner
    # TODO: eventually add a "shared__in" filter
    usage is: <domain>/api/bookmark/?owner=<user.pk>
    """

    class Meta:
        model = Bookmark
        fields = {
            "owner": ["exact"],
            # TODO: eventually add ``"shared": ["in"]` filter
        }


class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkGeoSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = BookmarkFilterSet
