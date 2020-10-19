from django_filters import rest_framework as filters
from django.shortcuts import get_object_or_404
from django.utils.functional import cached_property

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, BasePermission

from orbis.models import Order, LicencedCustomer as Customer
from orbis.serializers import OrderSerializer


class IsAdminOrManager(BasePermission):
    """
    Only the admin or a Customer Manager can access this view.
    (Relies on the property "active_managers" in the views below.)
    """

    message = "Only a customer manager can perform this action."

    def has_permission(self, request, view):
        user = request.user
        return user.is_superuser or view.active_managers.filter(user=user).exists()


class OrderFilterSet(filters.FilterSet):
    class Meta:
        model = Order
        fields = ("expired",)

    expired = filters.Filter(method="filter_expired")

    def filter_expired(self, queryset, name, value):
        return queryset.expired()


class OrderListCreateView(generics.ListCreateAPIView):

    permission_classes = [IsAuthenticated, IsAdminOrManager]
    serializer_class = OrderSerializer

    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = OrderFilterSet

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
