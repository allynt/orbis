import json

from django.conf import settings

from rest_framework import serializers

from maps.models import MapStyle, CustomerMapStyle


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
        url = obj.map_style.thumbnail.url
        request = self.context.get("request")

        if request is not None:
            return request.build_absolute_uri(url)

        return obj.map_style.thumbnail.url
