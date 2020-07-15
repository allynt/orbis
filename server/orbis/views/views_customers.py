from astrosat_users.views import (
    CustomerDetailView as AstrosatUsersCustomerDetailView,
    CustomerUserListView as AstrosatUsersCustomerUserListView,
    CustomerUserDetailView as AstrosatUsersCustomerUserDetailView,
)

from orbis.serializers import CustomerSerializer, CustomerUserSerializer


# overloading the customer views from astrosat_users
# b/c orbis adds the concept of (licences to) orbs


class CustomerDetailView(AstrosatUsersCustomerDetailView):
    serializer_class = CustomerSerializer

    def get_serializer_context(self):
        # the nested LicenceSerializer requires a "customer" field
        # I don't necessarily pass it in the request, so I use this extra context
        # to set the default field value using ContextVariableDefault
        context = super().get_serializer_context()
        context["customer"] = self.get_object()
        return context


class CustomerUserListView(AstrosatUsersCustomerUserListView):
    serializer_class = CustomerUserSerializer


class CustomerUserDetailView(AstrosatUsersCustomerUserDetailView):
    serializer_class = CustomerUserSerializer
