import pytest
from datetime import datetime, timedelta

from django.urls import resolve, reverse
from django.utils import timezone
from django.utils.duration import duration_string

from rest_framework import status
from rest_framework.settings import api_settings as drf_settings

from astrosat.tests.utils import *
from astrosat_users.models.models_users import UserRegistrationStageType
from astrosat_users.tests.utils import *

from orbis.models import OrderType, OrderItem, Order, Licence
from orbis.views.views_orders import IsManagerPermission

from .factories import *


@pytest.fixture
def create_order():
    """
    returns an Order w/ the correct type, items, licences, etc.
    """
    def _create_order(data):

        order_attr_keys = ["user", "customer", "order_type", "cost"]
        order_attrs = {key: data[key] for key in order_attr_keys if key in data}
        order = OrderFactory(**order_attrs)

        item_attr_keys = ["orb", "n_licences", "cost", "subscription_period"]
        for item_data in data["items"]:
            item_attrs = {
                key: item_data[key]
                for key in item_attr_keys if key in item_data
            }
            if "subscription_period" not in item_attrs:
                item_attrs["subscription_period"] = timedelta(days=365)
            item_attrs["order"] = order
            order_item = OrderItemFactory(**item_attrs)
            if "expiration" in item_data:
                order_item.expiration = item_data["expiration"]
                order_item.save()
            if "cost" not in item_data:
                order_item.recalculate_cost()

        if "cost" not in data:
            order.recalculate_cost()

        return order

    return _create_order


@pytest.mark.django_db
class TestOrders:
    def test_create_order(self, user, create_order, mock_storage):

        N_LICENCES = 10
        LICENCE_COST = 1.0
        DISCOUNT = 0.5

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory(licence_cost=LICENCE_COST)

        order_type = OrderTypeFactory(name="half-cost", cost_modifier=DISCOUNT)
        order_data = {
            "user": user,
            "customer": customer,
            "order_type": order_type,
            "items": [{
                "orb": orb,
                "n_licences": N_LICENCES,
            }]
        }
        order = create_order(order_data)
        order_item = order.items.first()

        assert order.cost == N_LICENCES * LICENCE_COST * DISCOUNT
        assert order.items.count() == 1
        assert order_item.cost == N_LICENCES * LICENCE_COST
        assert order_item.subscription_period == timedelta(days=365)
        assert order_item.expiration == order_item.created + order_item.subscription_period
        assert order_item.is_expired == False
        assert Licence.objects.count() == N_LICENCES

    def test_recalculate_cost(self, user, create_order, mock_storage):

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory(licence_cost=1.0)

        order_type = OrderTypeFactory(cost_modifier=1.0)
        order_data = {
            "user": user,
            "customer": customer,
            "order_type": order_type,
            "items": [{
                "orb": orb,
                "n_licences": 10,
            }]
        }
        order = create_order(order_data)
        order_item = order.items.first()

        assert order.cost == 10.0
        assert order_item.cost == 10.0

        order_type.cost_modifier = 0.25
        order_type.save()

        order.recalculate_cost()
        assert order.cost == 2.5
        assert order_item.cost == 10.0

        orb.licence_cost = 2.0
        orb.save()

        order_item.recalculate_cost()
        assert order.cost == 2.5
        assert order_item.cost == 20.0

        order.recalculate_cost()
        assert order.cost == 5.0
        assert order_item.cost == 20.0

    def test_expiration(self, mock_storage):

        order_items = [
            OrderItemFactory(
                n_licences=10, subscription_period=timedelta(days=365)
            ) for _ in range(10)
        ]

        assert OrderItem.objects.count() == 10
        assert OrderItem.objects.expired().count() == 0

        for order_item in order_items[:5]:
            # set some of the items to have an expiration in the past
            order_item.expiration = timezone.now() - timedelta(days=1)
            order_item.save()

        assert OrderItem.objects.count() == 10
        assert OrderItem.objects.expired().count() == 5

        expired_item = order_items[0]
        non_expired_item = order_items[-1]

        assert expired_item.is_expired == True
        assert non_expired_item.is_expired == False
        assert expired_item.subscription_period != non_expired_item.subscription_period


@pytest.mark.django_db
class TestOrderViews:
    def test_create_order(self, user, api_client, mock_storage):

        N_LICENCES = 10
        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory(licence_cost=1.0)

        order_type = OrderTypeFactory(cost_modifier=1.0)
        order_data = {
            "order_type": order_type.name,
            "items": [{
                "orb": orb.name,
                "n_licences": N_LICENCES,
            }]
        }

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_success(response.status_code)
        content = response.json()

        assert Order.objects.count() == 1
        assert Licence.objects.count() == N_LICENCES

        assert Order.objects.filter(uuid=content["id"]).exists()

        assert content["user"] == user.email
        assert content["cost"] == 10.0
        assert content["items"][0]["cost"] == 10.0
        assert content["items"][0]["subscription_period"] == duration_string(
            timedelta(days=365)
        )

    def test_create_order_custom_cost(self, user, api_client, mock_storage):

        CUSTOM_COST = 999.99

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory(licence_cost=1.0)

        order_type = OrderTypeFactory(cost_modifier=1.0)
        order_data = {
            "order_type": order_type.name,
            "cost": CUSTOM_COST,
            "items": [{
                "orb": orb.name,
                "n_licences": 10,
            }]
        }

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_success(response.status_code)
        content = response.json()

        order = Order.objects.get(uuid=content["id"])
        assert order.cost == content["cost"] == CUSTOM_COST

    def test_create_order_cannot_specify_expiration_and_subscription_duration(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory()

        order_type = OrderTypeFactory()
        order_data = {
            "order_type":
                order_type.name,
            "items": [{
                "orb": orb.name,
                "n_licences": 10,
                "subscription_period": timedelta(days=365),
                "expiration": timezone.now(),
            }]
        }

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_client_error(response.status_code)

        assert response.json()["items"] == [{
            drf_settings.NON_FIELD_ERRORS_KEY: [
                "'expiration' or 'subscription_period' can be provided, but not both."
            ]
        }]

    def test_create_order_custom_expiration(
        self, user, api_client, mock_storage
    ):

        CUSTOM_EXPIRATION = timezone.now() + timedelta(days=1)

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory()

        order_type = OrderTypeFactory()
        order_data = {
            "order_type":
                order_type.name,
            "items": [{
                "orb": orb.name,
                "n_licences": 10,
                "expiration": CUSTOM_EXPIRATION
            }]
        }

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_success(response.status_code)

        content = response.json()
        order_item = Order.objects.get(uuid=content["id"]).items.first()

        # w/ a expiration date one day in the future,
        # the subscription_period should be just less than one day
        # but the order should not have expired yet
        assert order_item.subscription_period <= timedelta(days=1)
        assert order_item.is_expired == False

    def test_create_order_must_be_manager(self, user, api_client, mock_storage):

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MEMBER", status="ACTIVE")

        orb = OrbFactory()

        order_type = OrderTypeFactory()
        order_data = {
            "order_type": order_type.name,
            "items": [{
                "orb": orb.name,
                "n_licences": 10,
            }]
        }

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_client_error(response.status_code)
        assert response.json()["detail"] == IsManagerPermission.message

    def test_create_order_resets_registration_stage(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory(licence_cost=1.0)

        order_type = OrderTypeFactory(cost_modifier=1.0)
        order_data = {
            "order_type": order_type.name,
            "items": [{
                "orb": orb.name,
                "n_licences": 10,
            }]
        }

        user.registration_stage = UserRegistrationStageType.ORDER
        user.save()

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_success(response.status_code)

        user.refresh_from_db()
        assert user.registration_stage == None

    def test_create_order_assigns_licence(self, user, api_client, mock_storage):

        customer = CustomerFactory(logo=None)
        customer_user, _ = customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory()

        order_type = OrderTypeFactory()
        order_data = {
            "order_type": order_type.name,
            "items": [{
                "orb": orb.name,
                "n_licences": 10,
            }]
        }

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_success(response.status_code)

        assert Licence.objects.filter(
            orb=orb,
            customer_user__isnull=True,
        ).count() == 9
        assert Licence.objects.filter(
            orb=orb,
            customer_user=customer_user,
        ).count() == 1

    def test_create_order_assigns_document_agreement(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory()

        terms_document = DocumentFactory(
            type=DocumentType.TERMS, is_active=True
        )
        orb.documents.add(terms_document)

        order_type = OrderTypeFactory()
        order_data = {
            "order_type": order_type.name,
            "items": [{
                "orb": orb.name,
                "n_licences": 10,
            }]
        }

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_success(response.status_code)

        assert terms_document in user.documents.all()

    def test_cannot_create_order_to_unpurchaseable_orb(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        orb = OrbFactory(can_purchase=False)

        order_type = OrderTypeFactory()
        order_data = {
            "order_type": order_type.name,
            "items": [{
                "orb": orb.name,
                "n_licences": 10,
            }]
        }

        client = api_client(user)
        url = reverse("orders-list", args=[customer.id])
        response = client.post(url, order_data, format="json")
        assert status.is_client_error(response.status_code)

        content = response.json()

        assert content["items"] == [{
            drf_settings.NON_FIELD_ERRORS_KEY: [
                f"Licences cannot be ordered for orb '{orb}'."
            ]
        }]
