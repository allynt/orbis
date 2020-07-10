import pytest

from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat.tests.utils import *
from astrosat_users.tests.utils import *

from orbis.serializers.serializers_orbs import LicenceSerializer

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
class TestLicences:
    def test_add_licences_to_customer(self, user, api_client, mock_storage):

        N_LICENCES = 10

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        client = api_client(user)
        url = reverse("customers-detail", args=[customer.id])
        response = client.get(url)
        customer_data = response.json()

        assert len(customer_data["licences"]) == 0

        orb = OrbFactory()
        # if I add (incomplete) licences for the orb, the serializer will
        # create it and add it to the customer w/ default (READ) access
        customer_data["licences"] = [{"orb": orb.name} for _ in range(N_LICENCES)]

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licences"]) == N_LICENCES
        for licence in Licence.objects.all():
            assert licence.orb == orb
            assert licence.customer == customer
            assert licence.access == Access.READ

    def test_remove_licences_from_customer(self, user, api_client, mock_storage):
        N_LICENCES = 10

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licences = [
            LicenceFactory(customer=customer, orb=orb) for _ in range(N_LICENCES)
        ]

        client = api_client(user)
        url = reverse("customers-detail", args=[customer.id])
        response = client.get(url)
        customer_data = response.json()

        assert len(customer_data["licences"]) == N_LICENCES

        customer_data["licences"] = customer_data["licences"][::2]

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licences"]) == N_LICENCES / 2
        for i, licence in enumerate(licences):
            if i % 2:
                assert not Licence.objects.filter(id=licence.id).exists()
            else:
                assert Licence.objects.filter(id=licence.id).exists()

    def test_add_update_remove_licences_from_customer(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licences = [
            LicenceFactory(customer=customer, orb=orb, access=Access.READ)
            for _ in range(4)
        ]

        client = api_client(user)
        url = reverse("customers-detail", args=[customer.id])
        response = client.get(url)
        customer_data = response.json()

        # delete the 1st 2 licences
        # update the next 2 licences
        # add 2 new licence
        customer_data["licences"] = customer_data["licences"][2:] + [
            {"orb": orb.name},
            {"orb": orb.name},
        ]
        customer_data["licences"][0]["access"] = Access.CREATE
        customer_data["licences"][1]["access"] = Access.CREATE

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licences"]) == 4
        assert str(licences[0].id) not in map(
            lambda x: x["id"], customer_data["licences"]
        )
        assert str(licences[1].id) not in map(
            lambda x: x["id"], customer_data["licences"]
        )
        assert str(licences[2].id) in map(lambda x: x["id"], customer_data["licences"])
        assert str(licences[3].id) in map(lambda x: x["id"], customer_data["licences"])
        assert customer_data["licences"][0]["access"] == Access.CREATE
        assert customer_data["licences"][1]["access"] == Access.CREATE
        assert customer_data["licences"][2]["access"] == Access.READ
        assert customer_data["licences"][3]["access"] == Access.READ

    def test_add_licences_to_customer_user(self, user, api_client, mock_storage):

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licence = LicenceFactory(customer=customer, orb=orb)

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer.id, user.uuid])
        response = client.get(url, format="json")
        customer_user_data = response.json()

        customer_user_data["licences"].append(licence.id)
        response = client.put(url, customer_user_data, format="json")
        customer_user_data = response.json()

        assert customer_user_data["licences"] == [str(licence.id)]
        assert [str(id) for id in customer_user.licences.values_list("id", flat=True)] == [str(licence.id)]
        assert customer.licences.count() == 1
        assert customer.licences.filter(customer_user__isnull=False).count() == 1

    def test_remove_licences_to_customer_user(self, user, api_client, mock_storage):

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licence = LicenceFactory(customer=customer, orb=orb, customer_user=customer_user)

        assert licence.customer_user == customer_user

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer.id, user.uuid])
        response = client.get(url, format="json")
        customer_user_data = response.json()

        customer_user_data["licences"] = []
        response = client.put(url, customer_user_data, format="json")
        customer_user_data = response.json()

        # after making the PUT request, check that the licence is no longer
        # associated w/ the user, but is still associated w/ the customer
        licence.refresh_from_db()
        assert licence.customer_user is None
        assert licence.customer == customer

    def test_add_remove_licences_from_customer_user(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()

        licence_1 = LicenceFactory(orb=orb, customer=customer, customer_user=customer_user)
        licence_2 = LicenceFactory(orb=orb, customer=customer, customer_user=None)

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer.id, user.uuid])
        response = client.get(url, format="json")
        customer_user_data = response.json()

        assert customer_user_data["licences"] == [str(licence_1.id)]

        customer_user_data["licences"] = [str(licence_2.id)]
        response = client.put(url, customer_user_data, format="json")
        customer_user_data = response.json()

        # after making the PUT request, check that licence_1 is no longer
        # associated w/ the user, but that licence_2 is
        assert customer_user_data["licences"] == [str(licence_2.id)]

        licence_1.refresh_from_db()
        licence_2.refresh_from_db()
        assert licence_1.customer_user is None
        assert licence_2.customer_user == customer_user


    def test_add_invalid_licences_to_customer_user(
        self, user, api_client, mock_storage
    ):

        customer_1 = CustomerFactory(logo=None)
        customer_2 = CustomerFactory(logo=None)
        (customer_user, _) = customer_1.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licence_1 = LicenceFactory(orb=orb, customer=customer_1)
        licence_2 = LicenceFactory(orb=orb, customer=customer_2)
        licence_3 = LicenceFactory(orb=orb, customer=customer_1)

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer_1.id, user.uuid])
        response = client.get(url, format="json")
        customer_user_data = response.json()

        assert len(customer_user_data["licences"]) == 0

        # I cannot add a licence to a customer_user from a different customer
        customer_user_data["licences"] = [str(licence_2.id)]
        response = client.put(url, customer_user_data, format="json")
        content = response.json()
        assert status.is_client_error(response.status_code)
        assert content["licences"] == [f"All licences must come from customer {customer_1.name}."]

        # I cannot add a licence w/ the same orb to a customer_user
        customer_user_data["licences"] = [str(licence_1.id), str(licence_3.id)]
        response = client.put(url, customer_user_data, format="json")
        content = response.json()
        assert status.is_client_error(response.status_code)
        assert content["licences"] == ["All licences must come from unique orbs."]

        # I cannot add a licence to a customer_user w/ an invalid id
        customer_user_data["licences"] = [shuffle_string(str(licence_1.id))]
        response = client.put(url, customer_user_data, format="json")
        content = response.json()
        assert status.is_client_error(response.status_code)

    def test_licence_has_access(self, mock_storage):

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()

        licences = [
            LicenceFactory(orb=orb, customer=customer, access=i)
            for i in range(sum(Access)+1)
        ]

        # licences should have the following access_rights...
        # 0 (000): nothing
        # 1 (001): READ
        # 2 (010): CREATE
        # 3 (011): READ, CREATE
        # 4 (100): DELETE
        # 5 (101): READ, DELETE
        # 6 (110): CREATE, DELETE
        # 7 (111): READ, CREATE, DELETE

        assert [licences.index(licence) for licence in Licence.objects.can_read()] == [1,3,5,7]
        assert [licences.index(licence) for licence in Licence.objects.can_create()] == [2,3,6,7]
        assert [licences.index(licence) for licence in Licence.objects.can_delete()] == [4,5,6,7]
