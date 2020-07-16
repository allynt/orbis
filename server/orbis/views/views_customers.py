from allauth.account.adapter import get_adapter

from astrosat_users.views import (
    CustomerDetailView as AstrosatUsersCustomerDetailView,
    CustomerUserListView as AstrosatUsersCustomerUserListView,
    CustomerUserDetailView as AstrosatUsersCustomerUserDetailView,
)

from orbis.serializers import CustomerSerializer, CustomerUserSerializer


# overloading the customer views from astrosat_users
# b/c orbis adds the concept of (licences to) orbs


class LicenceNotifyingMixIn(object):
    def notify_licences_changed(self, old_licences, new_licences, customer=None, customer_user=None):

        context = {
            "customer": customer,
            "customer_user": customer_user,
            "revoked_licences": ", ".join(
                map(lambda x: str(x.orb), old_licences - new_licences)
            ),
            "added_licences": ", ".join(
                map(lambda x: str(x.orb), new_licences - old_licences)
            ),
        }

        adapter = get_adapter(self.request)
        message = adapter.send_mail(
            "orbis/emails/update_licences", customer_user.user.email, context,
        )

        return message


class CustomerDetailView(AstrosatUsersCustomerDetailView):
    serializer_class = CustomerSerializer

    def get_serializer_context(self):
        # the nested LicenceSerializer requires a "customer" field
        # I don't necessarily pass it in the request, so I use this extra context
        # to set the default field value using ContextVariableDefault
        context = super().get_serializer_context()
        context["customer"] = self.get_object()
        return context


class CustomerUserListView(LicenceNotifyingMixIn, AstrosatUsersCustomerUserListView):
    serializer_class = CustomerUserSerializer

    def perform_create(self, serializer):

        customer_user = serializer.save()

        if customer_user.licences.count():
            message = self.notify_licences_changed(
                set(),
                set(customer_user.licences.all()),
                customer=self.customer,
                customer_user=customer_user,
            )
            if self.active_managers.filter(user=self.request.user).exists():
                # TODO...
                # only the superuser or a MANAGER can access this view
                # if it's the latter, do something w/ message
                pass

        return customer_user


class CustomerUserDetailView(LicenceNotifyingMixIn, AstrosatUsersCustomerUserDetailView):
    serializer_class = CustomerUserSerializer

    def perform_update(self, serializer):
        customer_user = self.get_object()

        old_licences = set(customer_user.licences.all())
        customer_user = serializer.save()
        new_licences = set(customer_user.licences.all())

        if old_licences != new_licences:

            message = self.notify_licences_changed(
                old_licences,
                new_licences,
                customer=self.customer,
                customer_user=customer_user,
            )
            if self.active_managers.filter(user=self.request.user).exists():
                # TODO...
                # only the superuser or a MANAGER can access this view
                # if it's the latter, do something w/ message
                pass

        return customer_user
