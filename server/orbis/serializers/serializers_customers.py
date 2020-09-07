from itertools import filterfalse

from django.db.models import CharField
from django.db.models.functions import Cast

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

    def to_internal_value(self, data):
        # when inputting data, include hidden licences...
        hidden_licences = self.instance.licences.hidden()
        data["licences"] += LicenceSerializer(hidden_licences, many=True).data
        return super().to_internal_value(data)

    def to_representation(self, instance):
        # when outputting data, exclude hidden licences...
        representation = super().to_representation(instance)
        licences_representation = representation.pop("licences", [])
        hidden_licences = instance.licences.hidden().annotate(
            str_id=Cast(
                "id", output_field=CharField()
            )  # cast UUIDField to CharField (for the comparison below)
        )
        representation["licences"] = filterfalse(
            lambda x: x["id"] in hidden_licences.values_list("str_id", flat=True),
            licences_representation,
        )

        return representation

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
        fields = (
            "id",
            "type",
            "status",
            "invitation_date",
            "user",
            "customer",
            "licences",
        )

    licences = serializers.SlugRelatedField(
        many=True, slug_field="id", queryset=Licence.objects.all()
    )

    def to_internal_value(self, data):
        # when inputting data, include hidden licences...
        if self.instance:
            # if the CustomerUser doesn't exist yet, then the post-save signal
            # will add the "core" licence; otherwise this bit of code will ensure
            # the "core" licence doesn't get removed (BUT SEE "create" BELOW)
            hidden_licences = self.instance.licences.hidden().annotate(
                str_id=Cast(
                    "id", output_field=CharField()
                )  # cast UUIDField to CharField
            )
            data["licences"] += hidden_licences.values_list("str_id", flat=True)
        internal_value = super().to_internal_value(data)
        return internal_value

    def create(self, validated_data):
        # TODO: I AM NOT HAPPY W/ THIS CODE !
        # the post-save signal already creates a "core" Licence for the
        # newly created CustomerUser, but the built-in DRF serializer.create fn
        # ovewrites m2m fields w/ the value in validated_data. Annoyingly, I can't
        # add the core licence to validated_data prior to calling create below
        # because that licence does not yet exist !
        customer_user = super().create(validated_data)
        customer_user.licences.add(
            customer_user.customer.licences.get(
                orb__is_core=True, customer_user__isnull=True
            )
        )
        return customer_user

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
