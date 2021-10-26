from collections import OrderedDict

from django.contrib.auth import get_user_model

from rest_framework import serializers

from astrosat.serializers import ContextVariableDefault
from astrosat.views import SwaggerCurrentUserDefault

from orbis.models import OrderType, Order, OrderItem, Orb, LicencedCustomer as Customer


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = (
            "id",
            "orb",
            "n_licences",
            "cost",
            "subscription_period",
            "expiration",
        )

    orb = serializers.SlugRelatedField(
        queryset=Orb.objects.all(), slug_field="name"
    )
    cost = serializers.FloatField(required=False)
    subscription_period = serializers.DurationField(required=False)
    expiration = serializers.DateTimeField(required=False)

    def create(self, validated_data):

        expiration_data = validated_data.pop("expiration", None)
        cost_data = validated_data.get("cost", None)
        order_item = OrderItem.objects.create(**validated_data)
        if expiration_data:
            # if expiration was specified then set it here...
            # (this will recompute subsription_period)
            order_item.expiration = expiration_data
            order_item.save()
        if not cost_data:
            # if cost was not supplied then compute it here...
            order_item.recalculate_cost()

        orb = order_item.orb
        user = order_item.order.user
        customer = order_item.order.customer
        customer_user = customer.customer_users.filter(user=user)
        customer.add_licences(orb, order_item.n_licences, order_item=order_item)
        customer.assign_licences(
            orb, customer_user, add_missing=False, ignore_existing=True
        )

        orb_terms_document = orb.documents.terms().active().first()
        if orb_terms_document:
            user.documents.add(orb_terms_document)

        return order_item

    def validate(self, data):
        orb = data["orb"]
        if not orb.can_purchase:
            raise serializers.ValidationError(
                f"Licences cannot be ordered for orb '{orb}'."
            )
            
        if "expiration" in data and "subscription_period" in data:
            raise serializers.ValidationError(
                "'expiration' or 'subscription_period' can be provided, but not both."
            )
            
        return data


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id",
            "report",
            "user",
            "customer",
            "created",
            "order_type",
            "cost",
            "items"
        )

    id = serializers.UUIDField(source="uuid", read_only=True)

    report = serializers.FileField(read_only=True)

    user = serializers.SlugRelatedField(
        default=SwaggerCurrentUserDefault(),
        queryset=get_user_model().objects.all(),
        slug_field="email",
    )

    customer = serializers.SlugRelatedField(
        default=ContextVariableDefault("customer", raise_error=True),
        queryset=Customer.objects.all(),
        slug_field="name",
        write_only=True,
    )

    created = serializers.DateTimeField(read_only=True)

    order_type = serializers.SlugRelatedField(
        queryset=OrderType.objects.all(), slug_field="name"
    )

    cost = serializers.FloatField(required=False)

    items = OrderItemSerializer(many=True)

    def create(self, validated_data):

        order_items_serializer = self.fields["items"]
        order_items_data = validated_data.pop(order_items_serializer.source, [])
        cost_serializer = self.fields["cost"]
        cost_data = validated_data.get(cost_serializer.source, None)

        order = super().create(validated_data)

        # create all the OrderItems, which will in turn create all the Licences
        order_items_serializer.create(
            map(lambda x: OrderedDict(x, order=order), order_items_data)
        )

        if not cost_data:
            # if cost was not supplied then compute it here...
            order.recalculate_cost()

        # once all the creation has finished, generate the report...
        order.generate_report(force_save=True)

        return order
