from rest_framework import serializers

from orbis.models import DataStorage


class DataStorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataStorage
        fields = (
            'id',
            'title',
            'created',
            'size',
        )
