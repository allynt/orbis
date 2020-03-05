import json

from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Polygon

from rest_framework import serializers
from rest_framework_gis.serializers import GeometryField

from astrosat.views import SwaggerCurrentUserDefault

from orbis.models import (
    Satellite,
    SatelliteResolution,
    SatelliteVisualisation,
    SatelliteSearch,
    SatelliteResult,
)


# TODO: REFACTOR THIS INTO django-astrosat-core


class SimplifiedGeometryField(serializers.Field):
    """
    don't deal w/ the WKT serialization of the GeoDjango field
    just deal w/ simpler arrays
    """

    def __init__(self, *args, **kwargs):
        self.precision = kwargs.pop("precision", 12)
        self.geometry_class = kwargs.pop("geometry_class")
        super().__init__(*args, **kwargs)

    def _recusive_round(self, value):
        # geometry potentially has nested sections;
        # this applies `round` recursively
        if hasattr(value, "__iter__"):
            return [self._recusive_round(v) for v in value]
        return round(value, self.precision)

    def to_representation(self, value):
        representation = self._recusive_round(value.coords)
        return representation[0]

    def to_internal_value(self, data):
        if isinstance(data, str):
            # data might have been passed as Stringified JSON
            data = json.loads(data)
        try:
            return self.geometry_class(data)
        except TypeError as e:
            raise ValidationError(str(e))


#####################
# satellite results #
#####################


class SatelliteResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SatelliteResult
        fields = (
            "id",
            "properties",
            "thumbnail_url",
            "tile_url",
            "download_url",
            "cloud_cover",
            "footprint",
            "satellite",
            "owner",
        )

    id = serializers.SlugField(source="scene_id")
    satellite = serializers.SlugRelatedField(slug_field="satellite_id", queryset=Satellite.objects.all())

    footprint = SimplifiedGeometryField(
        geometry_class=Polygon, precision=SatelliteSearch.PRECISION
    )

    owner = serializers.PrimaryKeyRelatedField(
        # (using a wrapper around CurrentUserDefault so that yasg doesn't complain)
        queryset=get_user_model().objects.all(),
        default=SwaggerCurrentUserDefault(),
    )

    def validate(self, data):
        # NOTE THAT THIS CODE IS MOSTLY DUPLICATED IN `SatelliteResult.clean()`
        # THIS IS BY DESIGN B/C OF https://github.com/encode/django-rest-framework/issues/3144

        # make sure owner is allowed to save this search result
        user = data["owner"]
        max_results = user.orbis_profile.max_results
        if not self.instance and user.satellite_results.count() >= max_results:
            raise serializers.ValidationError(
                f"Only {max_results} instances of SatelliteSearches are allowed for '{user}'."
            )

        return data


######################
# satellite searches #
######################


class SatelliteSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = SatelliteSearch
        # I don't have to do anything clever w/ nested serializers,
        # b/c satellites & resolutions will already exist in the db
        fields = (
            "id",
            "name",
            "satellites",
            "resolutions",
            "start_date",
            "end_date",
            "aoi",
            "owner",
            "created",
        )

    satellites = serializers.SlugRelatedField(
        slug_field="satellite_id", many=True, queryset=Satellite.objects.all()
    )

    resolutions = serializers.SlugRelatedField(
        slug_field="name", many=True, queryset=SatelliteResolution.objects.all()
    )

    aoi = SimplifiedGeometryField(
        geometry_class=Polygon, precision=SatelliteSearch.PRECISION
    )

    owner = serializers.PrimaryKeyRelatedField(
        # (using a wrapper around CurrentUserDefault so that yasg doesn't complain)
        queryset=get_user_model().objects.all(),
        default=SwaggerCurrentUserDefault(),
    )

    def validate(self, data):
        # NOTE THAT THIS CODE IS MOSTLY DUPLICATED IN `SatelliteSearch.clean()`
        # THIS IS BY DESIGN B/C OF https://github.com/encode/django-rest-framework/issues/3144

        # make sure data is valid
        if data["start_date"] > data["end_date"]:
            raise serializers.ValidationError(
                "end_date must be greater than or equal to start_date"
            )

        # make sure owner is allowed to save this search
        user = data["owner"]
        max_searches = user.orbis_profile.max_searches
        if not self.instance and user.satellite_searches.count() >= max_searches:
            raise serializers.ValidationError(
                f"Only {max_searches} instances of SatelliteSearches are allowed for '{user}'."
            )

        return data


##############
# satellites #
##############


class SatelliteVisualisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SatelliteVisualisation
        fields = (
            "id",
            "label",
            "description",
            "thumbnail",
        )

    id = serializers.SlugField(source="visualisation_id")
    label = serializers.CharField(source="title")


class SatelliteResolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SatelliteResolution
        fields = (
            "id",
            "label",
            "description",
        )

    id = serializers.SlugField(source="name")
    label = serializers.CharField(source="title")


class SatelliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Satellite
        fields = (
            "id",
            "label",
            "description",
            "resolutions",
            "visualisations",
        )

    id = serializers.SlugField(source="satellite_id")
    label = serializers.CharField(source="title")
    resolutions = SatelliteResolutionSerializer(many=True)
    visualisations = SatelliteVisualisationSerializer(many=True)
