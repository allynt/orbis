from itertools import filterfalse

from django.db.models import CharField
from django.db.models.functions import Cast

from rest_framework import serializers

from astrosat_users.models import Customer, CustomerUser
from astrosat_users.serializers import (
    CustomerSerializer as AstrosatUsersCustomerSerializer,
    CustomerUserSerializer as AstrosatUsersCustomerUserSerializer,
)

from orbis.models import Licence, Orb, LicencedCustomer
from orbis.serializers.serializers_orbs import LicenceSerializer


class CustomerSerializer(AstrosatUsersCustomerSerializer):
    class Meta:
        model = Customer
        fields = (
            "id",
            "type",
            "name",
            "official_name",
            "company_type",
            "registered_id",
            "vat_number",
            "description",
            "logo",
            "url",
            "country",
            "address",
            "postcode",
            "licences",
        )
        ref_name = "orbis_customer_serializer"

    licences = LicenceSerializer(many=True, required=False)
    logo = serializers.FileField(read_only=True)

    def to_internal_value(self, data):
        # when inputting data, include hidden licences...
        hidden_licences = self.instance.licences.hidden()
        data["licences"] += LicenceSerializer(hidden_licences, many=True).data
        return super().to_internal_value(data)

    def to_representation(self, instance):
        # when outputting data, exclude hidden licences...
        # yapf: disable
        representation = super().to_representation(instance)
        licences_representation = representation.pop("licences", [])
        hidden_licences = instance.licences.hidden().annotate(
            str_id=Cast(
                "id", output_field=CharField()
            )  # cast UUIDField to CharField (for the comparison below)
        )
        representation["licences"] = list(
            filterfalse(
                lambda x: x["id"] in hidden_licences.values_list("str_id", flat=True),
                licences_representation,
            )
        )

        return representation

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
        fields = (
            "id",
            "type",
            "status",
            "invitation_date",
            "user",
            "customer",
            "licences",
        )
        ref_name = "orbis_customer_user_serializer"

    licences = serializers.SlugRelatedField(
        many=True, slug_field="id", queryset=Licence.objects.all()
    )

    def to_internal_value(self, data):
        # when inputting data, include hidden licences...
        # yapf: disable
        if self.instance:
            hidden_licences = self.instance.licences.hidden().annotate(
                str_id=Cast("id", output_field=CharField())  # cast UUIDField to CharField
            )
            data["licences"] += hidden_licences.values_list("str_id", flat=True)
        internal_value = super().to_internal_value(data)
        return internal_value

    def to_representation(self, instance):
        # when outputting data, exclude hidden licences...
        representation = super().to_representation(instance)
        licences_representation = representation.pop("licences", [])
        hidden_licences = instance.licences.hidden()
        representation["licences"] = filterfalse(
            lambda x: x in hidden_licences.values_list("id", flat=True),
            licences_representation,
        )
        return representation

    def validate_licences(self, value):
        # make sure the licences all come from the correct customer...
        customer = self.context["customer"]
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

    def create(self, validated_data):
        """
        Performs a normal create, but then adds any default licences to the new customer_user
        """
        customer_user = super().create(validated_data)
        licenced_customer = LicencedCustomer.cast(customer_user.customer)
        licenced_customer.create_default_licences([customer_user])
        return customer_user

    def update(self, instance, validated_data):
        """
        Performs a normal update, but then adds removes any exclusive licences as needed
        """
        customer_user = super().update(instance, validated_data)
        licenced_customer = LicencedCustomer.cast(customer_user.customer)
        licenced_customer.remove_exclusive_licences([customer_user])
        return customer_user
