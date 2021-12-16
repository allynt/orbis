import json

from django.conf import settings
from django.contrib.gis.geos import Polygon, MultiPolygon, GEOSGeometry

from rest_framework import serializers
from rest_framework_gis.serializers import GeometryField

from drf_yasg2 import openapi

from satellites.models import (
    Satellite,
    SatelliteVisualisation,
    SatelliteSearch,
    SatelliteResult,
)

from satellites.utils import project_geometry

# TODO: REFACTOR THIS INTO django-astrosat-core


class SimplifiedGeometryField(serializers.Field):
    """
    don't deal w/ the actual WKT serialization of the GeoDjango field
    just deal w/ simple arrays (also adds some swagger-friendliness)
    """
    class Meta:
        swagger_schema_fields = openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(type=openapi.TYPE_NUMBER),
            ),
            example=[[55.000001, 1.000001], [55.000002, 1.000002]],
        )

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
            raise serializers.ValidationError(str(e))


class SwaggerGeometryField(GeometryField):
    """
    Just a standard rest_framework_gis GeometryField,
    but makes the swagger documentation a bit more user-friendly.
    """
    class Meta:
        swagger_schema_fields = {
            "type": openapi.TYPE_OBJECT,
            "properties": {
                "type":
                    openapi.Schema(
                        type=openapi.TYPE_STRING, example="GeometryType"
                    ),
                "coordinates":
                    openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_NUMBER),
                        ),
                        example=[[55.000001, 1.000001], [55.000002, 1.000002]],
                    ),
            },
        }


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


class SatelliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Satellite
        fields = (
            "id",
            "label",
            "description",
            "visualisations",
        )

    id = serializers.SlugField(source="satellite_id")
    label = serializers.CharField(source="title")
    visualisations = SatelliteVisualisationSerializer(many=True)


#####################
# satellite results #
#####################


class SatelliteResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SatelliteResult
        fields = (
            "id",
            "satellite",
            "cloudCover",
            "created",
            "footprint",
            "metadata",
            "thumbnail_url",
            "tile_url",
        )

    id = serializers.SlugField(source="scene_id")

    satellite = serializers.SlugRelatedField(
        slug_field="satellite_id", queryset=Satellite.objects.all()
    )

    cloudCover = serializers.FloatField(source="cloud_cover")

    footprint = SwaggerGeometryField(
        precision=SatelliteResult.PRECISION, remove_duplicates=True
    )


######################
# satellite searches #
######################


class SatelliteSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = SatelliteSearch
        fields = [
            "id",
            "satellites",
            "start_date",
            "end_date",
            "aoi",
            "created",
        ]

    satellites = serializers.SlugRelatedField(
        slug_field="satellite_id", many=True, queryset=Satellite.objects.all()
    )
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    aoi = SimplifiedGeometryField(
        geometry_class=Polygon, precision=SatelliteSearch.PRECISION
    )

    def validate(self, data):

        if data["start_date"] > data["end_date"]:
            raise serializers.ValidationError(
                "end_date must be greater than or equal to start_date."
            )

        projected_aoi = project_geometry(data["aoi"])
        if (projected_aoi.area * .000001) > settings.MAXIMUM_AOI_AREA:
            raise serializers.ValidationError(
                f"The area of the aoi must be less than or equal to {settings.MAXIMUM_AOI_AREA}."
            )

        return data
