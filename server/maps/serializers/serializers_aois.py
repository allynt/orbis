from django.contrib.auth import get_user_model

from django.contrib.gis.geos import GEOSGeometry

from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from astrosat.views import SwaggerCurrentUserDefault

from maps.models import Aoi


class GEOSGeometryField(serializers.Field):
    """
    Convert GeoJSON feature to/from WKT.
    """
    def to_representation(self, value):
        """ Convert Geometry to GeoJSON feature. """
        return GEOSGeometry(value).geojson

    def to_internal_value(self, data):
        """ Convert GeoJSON feature to Geometry. """
        return GEOSGeometry(data)


class AoiSerializer(serializers.ModelSerializer):
    """ Serializer for an Aoi. """
    class Meta:
        model = Aoi
        fields = (
            "id",
            "owner",
            "name",
            "description",
            "created",
            "modified",
            "geometry",
            "thumbnail",
        )
        validators = [
            UniqueTogetherValidator(
                queryset=Aoi.objects.all(),
                fields=['name', 'owner'],
            )
        ]

    owner = serializers.SlugRelatedField(
        # (using a wrapper around CurrentUserDefault so that yasg doesn't complain)
        queryset=get_user_model().objects.all(),
        default=SwaggerCurrentUserDefault(),
        slug_field="uuid"
    )

    geometry = GEOSGeometryField()
