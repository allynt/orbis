from django.shortcuts import get_object_or_404
from django.utils.functional import cached_property

from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission

from allauth.account.adapter import get_adapter

from astrosat.decorators import swagger_fake

from astrosat_users.models import CustomerUser
from astrosat_users.models.models_users import UserRegistrationStageType
from astrosat_users.views.views_customers import IsAdminOrManager

from orbis.models import Order, LicencedCustomer as Customer
from orbis.serializers import OrderSerializer


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """
    viewset that provides 'create', 'list', 'retrieve' action by default; but not
    'update' nor 'delete' actions
    """
    lookup_field = "uuid"
    lookup_url_kwarg = "order_id"
    permission_classes = [IsAuthenticated, IsAdminOrManager]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @cached_property
    @swagger_fake(None)
    def customer(self):
        customer_id = self.kwargs.get("customer_id")
        customer = get_object_or_404(Customer, id=customer_id)
        return customer

    @property
    @swagger_fake(CustomerUser.objects.none())
    def active_managers(self):
        customer_users = self.customer.customer_users.all()
        return customer_users.managers().active()

    def get_serializer_context(self):
        # the customer is a write_only field on the serializer
        # therefore I don't always provide it, I use this extra context
        # to compute a default field value using ContextVariableDefault
        context = super().get_serializer_context()
        context["customer"] = self.customer
        return context

    def perform_create(self, serializer):

        order = serializer.save()

        user = self.request.user
        if user.registration_stage == UserRegistrationStageType.ORDER:
            # this is part of the "team" self-signup...
            # so complete the ORDER stage, and perform the ONBOARD stage
            # (no need to set registration_stage to "ONBOARD" b/c I'm doing it here-and-now)
            user.onboard(adapter=get_adapter(self.request))
            user.registration_stage = None
            user.save()

        return order
