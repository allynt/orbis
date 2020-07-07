from rest_framework import serializers

from astrosat_users.models import Customer, CustomerUser
from astrosat_users.serializers import (
    CustomerSerializer as AstrosatUsersCustomerSerializer,
    CustomerUserSerializer as AstrosatUsersCustomerUserSerializer,
)

from orbis.models import License
from orbis.serializers.serializers_orbs import LicenseSerializer


class CustomerSerializer(AstrosatUsersCustomerSerializer):
    class Meta:
        model = Customer
        fields = (
            "type",
            "name",
            "title",
            "description",
            "logo",
            "url",
            "licenses",
        )

    licenses = LicenseSerializer(many=True, required=False)

    def create(self, validated_data):
        raise NotImplementedError("Customers can only be created manually in orbis")
        # return super().create(validated_data)

    def update(self, instance, validated_data):
        # LicenseSerializer uses "astrosat.serializers.WritableNestedListSerializer", this means
        # it has a "crud" method which works out which models to create/update/delete automatically
        licenses_serializer = self.fields["licenses"]
        licenses_data = validated_data.pop(licenses_serializer.source)
        licenses_serializer.crud(
            instances=instance.licenses.all(),
            validated_data=licenses_data,
            delete_missing=True,
        )
        customer = super().update(instance, validated_data)
        return customer


class CustomerUserSerializer(AstrosatUsersCustomerUserSerializer):
    class Meta:
        model = CustomerUser
        fields = ("id", "type", "status", "user", "customer", "licenses")

    licenses = serializers.SlugRelatedField(
        many=True, slug_field="id", queryset=License.objects.all()
    )

    def validate_licenses(self, value):

        # make sure the licenses all come from the correct customer...
        customer = self.instance.customer
        if not all(map(lambda x: x.customer == customer, value)):
            raise serializers.ValidationError(
                f"All licenses must come from customer {customer.name}."
            )

        # make sure the licenses all come from unique orbs...
        if not len(set(map(lambda x: x.orb, value))) == len(value):
            raise serializers.ValidationError(
                "All licenses must come from unique orbs."
            )

        return value
