import json

from django.conf import settings

from rest_framework import serializers

from maps.models import MapStyle, CustomerMapStyle


class MapStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapStyle
        fields = (
            "id",
            "name",
            "style",
            "thumbnail",
            "api_key",
        )


class CustomerMapStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerMapStyle
        fields = (
            "name",
            "style",
            "thumbnail",
            "api_key",
        )

    name = serializers.CharField(source="map_style.name", read_only=True)
    style = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    def get_style(self, obj):
        return json.load(obj.map_style.style)

    def get_thumbnail(self, obj):
        return obj.map_style.thumbnail.url
