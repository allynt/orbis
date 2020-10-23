from django.shortcuts import get_object_or_404
from django.utils.functional import cached_property

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, BasePermission

from astrosat_users.models.models_users import UserRegistrationStageType
from astrosat_users.views.views_customers import IsAdminOrManager

from orbis.models import Order, LicencedCustomer as Customer
from orbis.serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):

    permission_classes = [IsAuthenticated, IsAdminOrManager]
    serializer_class = OrderSerializer

    @cached_property
    def customer(self):
        customer_id = self.kwargs["customer_id"]
        customer = get_object_or_404(Customer, id=customer_id)
        return customer

    @property
    def active_managers(self):
        return self.customer.customer_users.managers().active()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            # queryset just for schema generation metadata (when there are no kwargs)
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return Order.objects.none()

        return self.customer.orders.all()

    def get_serializer_context(self):
        # the customer is a write_only field on the serializer
        # therefore I don't always provide it, I use this extra context
        # to compute a default field value using ContextVariableDefault
        context = super().get_serializer_context()
        if getattr(self, "swagger_fake_view", False):
            context["customer"] = None
        else:
            context["customer"] = self.customer
        return context

    def perform_create(self, serializer):

        order = serializer.save()

        user = self.request.user
        if user.registration_stage == UserRegistrationStageType.ORDER:
            user.registration_stage = None
            user.save()
            if not user.onboarded:
                user.onboard()

        return order
