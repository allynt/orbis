import json
import logging

from django.utils.decorators import method_decorator

from rest_framework.utils import encoders

from allauth.account.adapter import get_adapter

from astrosat.decorators import swagger_fake

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
    CustomerUserOnboardView as AstrosatUsersCustomerUserOnboardView,
)

from orbis.models import LicencedCustomer as Customer
from orbis.serializers import CustomerSerializer, CustomerUserSerializer

from astrosat.utils import format_elasticsearch_timestamp

db_logger = logging.getLogger("db")

# overloading the customer views from astrosat_users
# b/c orbis adds the concept of (licences to) orbs


class LicenceNotifyingMixIn(object):
    def notify_licences_changed(
        self, customer, customer_user, old_licences=set(), new_licences=set()
    ):

        context = {
            "customer": customer,
            "customer_user": customer_user,
            "revoked_licences": ", ".join(
                map(lambda x: str(x.orb), old_licences - new_licences)
            ),
            "added_licences": ", ".join(
                map(lambda x: str(x.orb), new_licences - old_licences)
            ),
        }  # yapf: disable

        adapter = get_adapter(self.request)
        message = adapter.send_mail(
            "orbis/emails/update_licences", customer_user.user.email, context
        )

        return message


# TODO: If the client allows updating of `Customer.logo` then these views will
# TODO: have to add `MultiPartParser` and `FormParser` to support file uploads
# TODO: and send data as FormData from the client.  Since it doesn't, though, I
# TODO: I have simply made the logo field read-only in CustomerSerializer for now.


@method_decorator(swagger_fake(Customer.objects.none()), name="get_queryset")
class CustomerCreateView(AstrosatUsersCustomerCreateView):
    # notice that I am not using the licence-aware (orbis) CustomerSerializer here
    # but rather the standard AstrosatUsersCustomerSerializer; this is b/c the only
    # way to add licences to a customer should be by creating an order
    serializer_class = AstrosatUsersCustomerSerializer

    def perform_create(self, serializer):
        customer = super().perform_create(serializer)
        user = self.request.user

        # log this event in the db...
        customer_data = AstrosatUsersCustomerSerializer(instance=customer).data
        customer_data["created"] = customer.created

        event = {
            "type": "orbisUserAction",
            "orbisUserAction": {
                "action": "customerCreated",
                "customerId": customer_data["id"],
                "customerName": customer_data["name"],
                "userId": user.uuid,
                "customerCreated": {
                    "customerCreatedAt":
                        format_elasticsearch_timestamp(
                            customer.created.timestamp()
                        ),
                },
            }
        }

        db_logger.info(
            json.dumps(event, cls=encoders.JSONEncoder),
            extra={"tags": [customer.name, "CUSTOMER_CREATE"]},
        )

        return customer


@method_decorator(swagger_fake(None), name="get_object")
@method_decorator(swagger_fake(Customer.objects.none()), name="get_queryset")
class CustomerUpdateView(AstrosatUsersCustomerUpdateView):

    serializer_class = CustomerSerializer

    def get_serializer_context(self):
        # the nested LicenceSerializer requires a "customer" field
        # I don't necessarily pass it in the request, so I use this extra context
        # to set the default field value using ContextVariableDefault
        context = super().get_serializer_context()
        context["customer"] = self.get_object()
        return context


class CustomerUserListView(
    LicenceNotifyingMixIn, AstrosatUsersCustomerUserListView
):
    serializer_class = CustomerUserSerializer

    def perform_create(self, serializer):

        user = self.request.user

        customer_user = serializer.save()
        created_user = customer_user.user

        if user == created_user:
            if (
                created_user.registration_stage ==
                UserRegistrationStageType.CUSTOMER_USER
            ):
                # if we are adding ourselves to a customer as part of the "team" registration
                # then make sure the next thing we do is create an order
                created_user.registration_stage = UserRegistrationStageType.ORDER
                created_user.save()

        else:
            customer_user.invite(adapter=get_adapter(self.request))
            if not created_user.onboarded:
                # if we are adding somebody new to a customer
                # then make sure the next thing they do is get onboarded
                created_user.registration_stage = UserRegistrationStageType.ONBOARD
                created_user.save()

        if customer_user.licences.visible().count():
            msg = self.notify_licences_changed(
                self.customer,
                customer_user,
                old_licences=set(),
                new_licences=set(customer_user.licences.visible()),
            )
            if self.active_managers.filter(user=user).exists():
                # only the superuser or a MANAGER can access this view
                # if it's the latter, do something w/ msg
                user.add_message(
                    title=msg.subject,
                    sender=msg.from_email,
                    content=msg.body,
                )

        return customer_user


class CustomerUserDetailView(
    LicenceNotifyingMixIn, AstrosatUsersCustomerUserDetailView
):
    serializer_class = CustomerUserSerializer

    def perform_update(self, serializer):

        user = self.request.user

        customer_user = self.get_object()

        old_licences = set(customer_user.licences.visible())
        customer_user = super().perform_update(serializer)
        new_licences = set(customer_user.licences.visible())

        if old_licences != new_licences:

            msg = self.notify_licences_changed(
                self.customer,
                customer_user,
                old_licences=old_licences,
                new_licences=new_licences,
            )
            if self.active_managers.filter(user=user).exists():
                # only the superuser or a MANAGER can access this view
                # if it's the latter, do something w/ msg
                user.add_message(
                    title=msg.subject,
                    sender=msg.from_email,
                    content=msg.body,
                )

        return customer_user

    def perform_destroy(self, instance):
        # just like the super method, we notify the user they've left the customer
        # but w/in orbis, we add extra context about licences to the uninvite method
        # we should also delete the corresponding user
        # TODO: WHAT HAPPENS TO THE USER'S DATA/BOOKMARKS/ETC ?
        user = instance.user
        uninvitation_context = {
            "licences":
                instance.licences.visible().values_list("orb__name", flat=True)
        }
        destroyed_value = instance.uninvite(
            adapter=get_adapter(self.request),
            context=uninvitation_context,
            force_deletion=True,
        )
        user.delete()
        return destroyed_value


class CustomerUserInviteView(
    LicenceNotifyingMixIn, AstrosatUsersCustomerUserInviteView
):
    serializer_class = CustomerUserSerializer


class CustomerUserOnboardView(
    LicenceNotifyingMixIn, AstrosatUsersCustomerUserOnboardView
):
    serializer_class = CustomerUserSerializer
