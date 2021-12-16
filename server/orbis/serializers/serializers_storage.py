from rest_framework import serializers

from astrosat.serializers import ContextVariableDefault

from astrosat_users.models import CustomerUser

from orbis.models import DataStorage, StoredDataSource


class DataStorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataStorage
        fields = (
            'id',
            'title',
            'created',
            'size',
        )


class StoredDataSourceSerializer(serializers.Serializer):
    # note that this is a Serializer rather than a ModelSerializer
    # since DRF cannot use a ModelSerializer w/ Abstract Models
    # as per https://stackoverflow.com/a/64149396/1060339
    class Meta:
        fields = (
            "source_id",
            "created",
            "name",
            "description",
            "type",
            "metadata",
            "orbs",
            "categories",
            "customer_user",
            "data_storage",
        )

    # I have to explicitly define _every_ field
    # b/c this is a Serializer rather than a ModelSerializer

    source_id = serializers.UUIDField(read_only=True)

    created = serializers.DateTimeField(read_only=True)

    name = serializers.CharField()

    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    type = serializers.CharField(default=ContextVariableDefault("type"))

    metadata = serializers.JSONField(read_only=True)

    orbs = serializers.JSONField(
        default=ContextVariableDefault("orbs"),
        write_only=True,
    )

    categories = serializers.JSONField(
        default=ContextVariableDefault("categories"),
        write_only=True,
    )

    customer_user = serializers.PrimaryKeyRelatedField(
        queryset=CustomerUser.objects.all(),
        default=ContextVariableDefault("customer_user", raise_error=True),
        write_only=True,
    )

    data_storage = serializers.HyperlinkedRelatedField(
        many=False,
        view_name="storage-detail",
        queryset=DataStorage.objects.all(),
        default=ContextVariableDefault("storage"),
        write_only=True,
    )
