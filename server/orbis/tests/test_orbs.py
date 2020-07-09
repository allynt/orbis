import pytest

from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat.tests.utils import *
from astrosat_users.tests.utils import *

from orbis.serializers.serializers_orbs import LicenseSerializer

from .factories import *


@pytest.mark.django_db
class TestOrbs:
    def test_get_orbs_view(self, user, api_client, mock_storage):

        N_ORBS = 10
        [OrbFactory() for _ in range(N_ORBS)]

        client = api_client(user)

        url = reverse("orbs-list")
        response = client.get(url)
        content = response.json()

        assert status.is_success(response.status_code)
        assert len(content) == N_ORBS


@pytest.mark.django_db
class TestLicenses:
    def test_add_licenses_to_customer(self, user, api_client, mock_storage):

        N_LICENSES = 10

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        client = api_client(user)
        url = reverse("customers-detail", args=[customer.id])
        response = client.get(url)
        customer_data = response.json()

        assert len(customer_data["licenses"]) == 0

        orb = OrbFactory()
        # if I add (incomplete) licenses for the orb, the serializer will
        # create it and add it to the customer w/ default (READ) access
        customer_data["licenses"] = [{"orb": orb.name} for _ in range(N_LICENSES)]

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licenses"]) == N_LICENSES
        for license in License.objects.all():
            assert license.orb == orb
            assert license.customer == customer
            assert license.access == Access.READ

    def test_remove_licenses_from_customer(self, user, api_client, mock_storage):
        N_LICENSES = 10

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licenses = [
            LicenseFactory(customer=customer, orb=orb) for _ in range(N_LICENSES)
        ]

        client = api_client(user)
        url = reverse("customers-detail", args=[customer.id])
        response = client.get(url)
        customer_data = response.json()

        assert len(customer_data["licenses"]) == N_LICENSES

        customer_data["licenses"] = customer_data["licenses"][::2]

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licenses"]) == N_LICENSES / 2
        for i, license in enumerate(licenses):
            if i % 2:
                assert not License.objects.filter(id=license.id).exists()
            else:
                assert License.objects.filter(id=license.id).exists()

    def test_add_update_remove_licenses_from_customer(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licenses = [
            LicenseFactory(customer=customer, orb=orb, access=Access.READ)
            for _ in range(4)
        ]

        client = api_client(user)
        url = reverse("customers-detail", args=[customer.id])
        response = client.get(url)
        customer_data = response.json()

        # delete the 1st 2 licenses
        # update the next 2 licenses
        # add 2 new license
        customer_data["licenses"] = customer_data["licenses"][2:] + [
            {"orb": orb.name},
            {"orb": orb.name},
        ]
        customer_data["licenses"][0]["access"] = Access.CREATE
        customer_data["licenses"][1]["access"] = Access.CREATE

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licenses"]) == 4
        assert str(licenses[0].id) not in map(
            lambda x: x["id"], customer_data["licenses"]
        )
        assert str(licenses[1].id) not in map(
            lambda x: x["id"], customer_data["licenses"]
        )
        assert str(licenses[2].id) in map(lambda x: x["id"], customer_data["licenses"])
        assert str(licenses[3].id) in map(lambda x: x["id"], customer_data["licenses"])
        assert customer_data["licenses"][0]["access"] == Access.CREATE
        assert customer_data["licenses"][1]["access"] == Access.CREATE
        assert customer_data["licenses"][2]["access"] == Access.READ
        assert customer_data["licenses"][3]["access"] == Access.READ

    def test_add_licenses_to_customer_user(self, user, api_client, mock_storage):

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        license = LicenseFactory(customer=customer, orb=orb)

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer.id, user.uuid])
        response = client.get(url, format="json")
        customer_user_data = response.json()

        customer_user_data["licenses"].append(license.id)
        response = client.put(url, customer_user_data, format="json")
        customer_user_data = response.json()

        assert customer_user_data["licenses"] == [str(license.id)]
        assert [str(id) for id in customer_user.licenses.values_list("id", flat=True)] == [str(license.id)]
        assert customer.licenses.count() == 1
        assert customer.licenses.filter(customer_user__isnull=False).count() == 1

    def test_remove_licenses_to_customer_user(self, user, api_client, mock_storage):

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        license = LicenseFactory(customer=customer, orb=orb, customer_user=customer_user)

        assert license.customer_user == customer_user

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer.id, user.uuid])
        response = client.get(url, format="json")
        customer_user_data = response.json()

        customer_user_data["licenses"] = []
        response = client.put(url, customer_user_data, format="json")
        customer_user_data = response.json()

        # after making the PUT request, check that the license is no longer
        # associated w/ the user, but is still associated w/ the customer
        license.refresh_from_db()
        assert license.customer_user is None
        assert license.customer == customer

    def test_add_remove_licenses_from_customer_user(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()

        license_1 = LicenseFactory(orb=orb, customer=customer, customer_user=customer_user)
        license_2 = LicenseFactory(orb=orb, customer=customer, customer_user=None)

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer.id, user.uuid])
        response = client.get(url, format="json")
        customer_user_data = response.json()

        assert customer_user_data["licenses"] == [str(license_1.id)]

        customer_user_data["licenses"] = [str(license_2.id)]
        response = client.put(url, customer_user_data, format="json")
        customer_user_data = response.json()

        # after making the PUT request, check that license_1 is no longer
        # associated w/ the user, but that license_2 is
        assert customer_user_data["licenses"] == [str(license_2.id)]

        license_1.refresh_from_db()
        license_2.refresh_from_db()
        assert license_1.customer_user is None
        assert license_2.customer_user == customer_user


    def test_add_invalid_licenses_to_customer_user(
        self, user, api_client, mock_storage
    ):

        customer_1 = CustomerFactory(logo=None)
        customer_2 = CustomerFactory(logo=None)
        (customer_user, _) = customer_1.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        license_1 = LicenseFactory(orb=orb, customer=customer_1)
        license_2 = LicenseFactory(orb=orb, customer=customer_2)
        license_3 = LicenseFactory(orb=orb, customer=customer_1)

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer_1.id, user.uuid])
        response = client.get(url, format="json")
        customer_user_data = response.json()

        assert len(customer_user_data["licenses"]) == 0

        # I cannot add a license to a customer_user from a different customer
        customer_user_data["licenses"] = [str(license_2.id)]
        response = client.put(url, customer_user_data, format="json")
        content = response.json()
        assert status.is_client_error(response.status_code)
        assert content["licenses"] == [f"All licenses must come from customer {customer_1.name}."]

        # I cannot add a license w/ the same orb to a customer_user
        customer_user_data["licenses"] = [str(license_1.id), str(license_3.id)]
        response = client.put(url, customer_user_data, format="json")
        content = response.json()
        assert status.is_client_error(response.status_code)
        assert content["licenses"] == ["All licenses must come from unique orbs."]

        # I cannot add a license to a customer_user w/ an invalid id
        customer_user_data["licenses"] = [shuffle_string(str(license_1.id))]
        response = client.put(url, customer_user_data, format="json")
        content = response.json()
        assert status.is_client_error(response.status_code)

    def test_license_has_access(self, mock_storage):

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()

        licenses = [
            LicenseFactory(orb=orb, customer=customer, access=i)
            for i in range(sum(Access)+1)
        ]

        # licenses should have the following access_rights...
        # 0 (000): nothing
        # 1 (001): READ
        # 2 (010): CREATE
        # 3 (011): READ, CREATE
        # 4 (100): DELETE
        # 5 (101): READ, DELETE
        # 6 (110): CREATE, DELETE
        # 7 (111): READ, CREATE, DELETE

        assert [licenses.index(license) for license in License.objects.can_read()] == [1,3,5,7]
        assert [licenses.index(license) for license in License.objects.can_create()] == [2,3,6,7]
        assert [licenses.index(license) for license in License.objects.can_delete()] == [4,5,6,7]
