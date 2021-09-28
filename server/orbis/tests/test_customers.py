import pytest

from django.urls import reverse

from rest_framework import status

from astrosat.tests.utils import *
from astrosat_users.tests.utils import *

from .factories import *


@pytest.mark.django_db
class TestCustomerUserViews:
    def test_create_customer_user_adds_default_licences(
        self, user, api_client, mock_storage
    ):
        # tests that adding a user to a customer via the CustomerUserView
        # correctly assigns any default Orbs to that user

        default_orb = OrbFactory(is_default=True)

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")
        customer.add_licences(default_orb, 1)

        test_user = UserFactory(avatar=None)
        test_data = {
            "customer": customer.name,
            "user": {
                "email": test_user.email,
                "name": test_user.name,
            },
            "licences": []
        }

        client = api_client(user)
        url = reverse("customer-users-list", args=[customer.id])
        response = client.post(url, data=test_data, format="json")
        assert status.is_success(response.status_code)

        licences = customer.customer_users.get(user=test_user).licences.all()
        assert licences.count() == 1
        assert default_orb in Orb.objects.filter(licences__in=licences)

    def test_update_customer_user_removes_exclusive_licences(
        self, user, api_client, mock_storage
    ):
        # tests that adding a non-exclusive licence to a user via the API
        # correctly removes any exlusive licences from that user

        exclusive_orb = OrbFactory(is_exclusive=True)
        normal_orb = OrbFactory(is_exclusive=False)

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")
        test_customer_user, _ = customer.add_user(
            UserFactory(avatar=None), type="MEMBER", status="ACTIVE"
        )
        test_user = test_customer_user.user
        customer.add_licences(exclusive_orb, 1)
        customer.add_licences(normal_orb, 1)
        customer.assign_licences(exclusive_orb, [test_customer_user])

        # before the update the user has a licence to exclusive_orb only...
        licences = test_customer_user.licences.all()
        orbs = Orb.objects.filter(licences__in=licences)
        assert licences.count() == 1
        assert exclusive_orb in orbs and normal_orb not in orbs

        test_data = {
            "customer": customer.name,
            "user": {
                "email": test_user.email,
                "name": test_user.name,
            },
            "licences": [Licence.objects.get(orb=normal_orb).id]
        }

        client = api_client(user)
        url = reverse(
            "customer-users-detail", args=[customer.id, test_user.uuid]
        )
        response = client.put(url, data=test_data, format="json")
        assert status.is_success(response.status_code)

        # after the update the user has a licence to normal_orb only...
        licences = test_customer_user.licences.all()
        orbs = Orb.objects.filter(licences__in=licences)
        assert licences.count() == 1
        assert exclusive_orb not in orbs and normal_orb in orbs
