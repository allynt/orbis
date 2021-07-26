from rest_framework import serializers

from astrosat.serializers import ContextVariableDefault, WritableNestedListSerializer

from astrosat_users.models import Customer

from orbis.models import Orb, Licence


class OrbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orb
        fields = (
            "id",
            "name",
            "description",
            "logo",
            "features",
            "licence_cost",
        )


class LicenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Licence
        fields = (
            "id",
            "orb",
            "customer",
            "customer_user",
            "access",
        )
        list_serializer_class = WritableNestedListSerializer

    id = serializers.UUIDField(read_only=True)
    orb = serializers.SlugRelatedField(
        slug_field="name", queryset=Orb.objects.active()
    )
    customer = serializers.SlugRelatedField(
        # a licence can only exist w/ a pre-existing customer, and
        # I will only CRUD licences in the context of a customer, so
        # if I don't include a customer, provide it from the context
        default=ContextVariableDefault("customer"),
        queryset=Customer.objects.all(),
        slug_field="name",
    )

    def to_internal_value(self, data):
        # put the read-only "id" field back, since it's used to
        # identify unique models in WriteableNestedListSerializer
        id_field_name = "id"
        internal_value = super().to_internal_value(data)
        if id_field_name not in internal_value and id_field_name in data:
            id_field_serializer = self.fields[id_field_name]
            internal_value[id_field_name
                          ] = id_field_serializer.to_internal_value(
                              data[id_field_name]
                          )
        return internal_value
