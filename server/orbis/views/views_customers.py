from allauth.account.adapter import get_adapter

from astrosat_users.models.models_users import UserRegistrationStageType
from astrosat_users.serializers import (
    CustomerSerializer as AstrosatUsersCustomerSerializer,
    CustomerUserSerializer as AstrosatUsersCustomerUserSerializer,
)
from astrosat_users.views import (
    CustomerCreateView as AstrosatUsersCustomerCreateView,
    CustomerUpdateView as AstrosatUsersCustomerUpdateView,
    CustomerUserListView as AstrosatUsersCustomerUserListView,
    CustomerUserDetailView as AstrosatUsersCustomerUserDetailView,
    CustomerUserInviteView as AstrosatUsersCustomerUserInviteView,
)

from orbis.serializers import CustomerSerializer, CustomerUserSerializer


# overloading the customer views from astrosat_users
# b/c orbis adds the concept of (licences to) orbs


class LicenceNotifyingMixIn(object):
    def notify_licences_changed(self, customer, customer_user, old_licences=set(), new_licences=set()):

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
        managers_emails = customer.customer_users.managers().values_list("user__email", flat=True)
        message = adapter.send_mail(
            "orbis/emails/update_licences", customer_user.user.email, context, cc=managers_emails,
        )

        return message


class CustomerCreateView(AstrosatUsersCustomerCreateView):
    # notice that I am not using the licence-aware (orbis) CustomerSerializer here
    # but rather the standard AstrosatUsersCustomerSerializer; this is b/c the only
    # way to add licences to a customer should be by creating an order
    serializer_class = AstrosatUsersCustomerSerializer


class CustomerUpdateView(AstrosatUsersCustomerUpdateView):
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

        user = self.request.user

        customer_user = serializer.save()
        created_user = customer_user.user

        if user == created_user and created_user.registration_stage == UserRegistrationStageType.CUSTOMER_USER:
            # if we are adding ourselves to a customer as part of the "team" registration
            # then make sure the next thing we do is create an order
            created_user.registration_stage = UserRegistrationStageType.ORDER
            created_user.save()

        customer_user.invite(adapter=get_adapter(self.request))

        if user != created_user and not created_user.onboarded:
            # if we are adding somebody new to a customer
            # then make sure the next thing they do is get onboarded
            created_user.registration_stage = UserRegistrationStageType.USER
            created_user.save()

        if customer_user.licences.visible().count():
            message = self.notify_licences_changed(
                self.customer,
                customer_user,
                old_licences=set(),
                new_licences=set(customer_user.licences.visible()),
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

        old_licences = set(customer_user.licences.visible())
        customer_user = serializer.save()
        new_licences = set(customer_user.licences.visible())

        if old_licences != new_licences:

            message = self.notify_licences_changed(
                self.customer,
                customer_user,
                old_licences=old_licences,
                new_licences=new_licences,
            )
            if self.active_managers.filter(user=self.request.user).exists():
                # TODO...
                # only the superuser or a MANAGER can access this view
                # if it's the latter, do something w/ message
                pass

        return customer_user

    def perform_destroy(self, instance):
        # just like the super method, we notify the user they've left the customer
        # but w/in orbis, we add extra context about licences to the uninvite method
        # we should also delete the corresponding user
        # TODO: WHAT HAPPENS TO THE USER'S DATA/BOOKMARKS/ETC ?
        user = instance.user
        uninvitation_context = {
            "licences": instance.licences.visible().values_list("orb__name", flat=True)
        }
        destroyed_value = instance.uninvite(adapter=get_adapter(self.request), context=uninvitation_context, force_deletion=True)
        user.delete()
        return destroyed_value


class CustomerUserInviteView(LicenceNotifyingMixIn, AstrosatUsersCustomerUserInviteView):
    serializer_class = CustomerUserSerializer
