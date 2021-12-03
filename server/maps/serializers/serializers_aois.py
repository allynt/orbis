from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from rest_framework_gis.serializers import GeometryField

from astrosat.views import SwaggerCurrentUserDefault

from maps.models import Aoi


class AoiUpdateSerializer(serializers.ModelSerializer):
    """ Serializer for actions on an existing Aoi. """
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
            "data_source"
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

    geometry = GeometryField(
        precision=Aoi.PRECISION,
        remove_duplicates=True,
        read_only=True,
    )
    thumbnail = serializers.FileField(read_only=True)
    data_source = serializers.CharField(read_only=True)


class AoiCreateSerializer(AoiUpdateSerializer):
    """ Serializer for create action on an Aoi only. """
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
            "data_source"
        )
        validators = [
            UniqueTogetherValidator(
                queryset=Aoi.objects.all(),
                fields=['name', 'owner'],
            )
        ]

    geometry = GeometryField(
        precision=Aoi.PRECISION,
        remove_duplicates=True,
        required=True,
    )
    thumbnail = serializers.FileField(required=True)
    data_source = serializers.CharField(required=True)
