from rest_framework import serializers

from maps.models import Satellite, SatelliteScene, SatelliteVisualisation


class SatelliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Satellite
        fields = (
            "id",
            "label",
            "description",
        )

    id = serializers.SlugField(source="satellite_id")
    label = serializers.CharField(source="title")


class SatelliteSceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SatelliteScene
        fields = (
            "id",
            "properties",
            "thumbnail",
            "satellite",

        )

    id = serializers.SlugField(source="scene_id")
    satellite = serializers.SlugRelatedField(read_only=True, slug_field="satellite_id")


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
