from rest_framework import serializers

from astrosat_users.models import Customer, CustomerUser
from astrosat_users.serializers import (
    CustomerSerializer as AstrosatUsersCustomerSerializer,
    CustomerUserSerializer as AstrosatUsersCustomerUserSerializer,
)

from orbis.models import Licence
from orbis.serializers.serializers_orbs import LicenceSerializer


class CustomerSerializer(AstrosatUsersCustomerSerializer):
    class Meta:
        model = Customer
        fields = (
            "id",
            "type",
            "name",
            "title",
            "description",
            "logo",
            "url",
            "country",
            "address",
            "postcode",
            "licences",
        )

    licences = LicenceSerializer(many=True, required=False)

    def create(self, validated_data):
        raise NotImplementedError("Customers can only be created manually in orbis")

    def update(self, instance, validated_data):
        # LicenceSerializer uses "astrosat.serializers.WritableNestedListSerializer", this means
        # it has a "crud" method which works out which models to create/update/delete automatically
        licences_serializer = self.fields["licences"]
        licences_data = validated_data.pop(licences_serializer.source)
        licences_serializer.crud(
            instances=instance.licences.all(),
            validated_data=licences_data,
            delete_missing=True,
        )
        customer = super().update(instance, validated_data)
        return customer


class CustomerUserSerializer(AstrosatUsersCustomerUserSerializer):
    class Meta:
        model = CustomerUser
        fields = ("id", "type", "status", "user", "customer", "licences")

    licences = serializers.SlugRelatedField(
        many=True, slug_field="id", queryset=Licence.objects.all()
    )

    def validate_licences(self, value):

        # make sure the licences all come from the correct customer...
        customer = self.instance.customer
        if not all(map(lambda x: x.customer == customer, value)):
            raise serializers.ValidationError(
                f"All licences must come from customer {customer.name}."
            )

        # make sure the licences all come from unique orbs...
        if not len(set(map(lambda x: x.orb, value))) == len(value):
            raise serializers.ValidationError(
                "All licences must come from unique orbs."
            )

        return value
