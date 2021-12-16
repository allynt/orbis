from rest_framework import serializers

from astrosat.serializers import ConsolidatedErrorsSerializerMixin

from orbis.serializers import StoredDataSourceSerializer

from satellites.models import SatelliteDataSource

# note these classes inherit from StoredDataSourceSerializer AND ModelSerializer
# b/c DRF cannot use a ModelSerializer w/ Abstract Models
# as per https://stackoverflow.com/a/64149396/1060339
# (see comment in "orbis.serializers.serializers_storage")


class SatelliteDataSourceSerializer(
    ConsolidatedErrorsSerializerMixin,
    StoredDataSourceSerializer,
    serializers.ModelSerializer,
):
    class Meta:
        model = SatelliteDataSource
        fields = StoredDataSourceSerializer.Meta.fields

    def validate(self, data):

        name = data.get("name")
        customer_user = data.get("customer_user")
        if SatelliteDataSource.objects.filter(
            name=name, customer_user=customer_user
        ).exists():
            raise serializers.ValidationError(
                f"An image named '{name}' already exists for user '{customer_user.user}'."
            )

        return data


class SatelliteDataSourceCreateSerializer(SatelliteDataSourceSerializer):
    class Meta:
        model = SatelliteDataSource
        fields = SatelliteDataSourceSerializer.Meta.fields + (
            "satellite_id",
            "scene_id",
            "visualisation_id",
        )

    satellite_id = serializers.SlugField(write_only=True)
    scene_id = serializers.SlugField(write_only=True)
    visualisation_id = serializers.SlugField(write_only=True)
