import pytest

from django.core import mail
from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat.tests.utils import *
from astrosat_users.tests.utils import *

from orbis.models import Licence, Orb
from orbis.serializers.serializers_orbs import LicenceSerializer

from .factories import *


@pytest.mark.django_db
class TestOrbsViews:
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
class TestLicencesViews:
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
        customer_data["licences"] += [{"orb": orb.name} for _ in range(N_LICENCES)]

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licences"]) == N_LICENCES
        assert Licence.objects.count() == N_LICENCES
        for licence in Licence.objects.all():
            assert licence.orb == orb
            assert licence.customer == customer
            assert licence.access == Access.READ

    def test_remove_licences_from_customer(self, user, api_client, mock_storage):
        N_LICENCES = 10

        # (again, the core licence will exist, but it is hidden by default)

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

        customer_user_data["licences"].append(str(licence.id))
        response = client.put(url, customer_user_data, format="json")
        customer_user_data = response.json()

        assert str(licence.id) in customer_user_data["licences"]
        assert licence in customer_user.licences.all()
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

        assert str(licence_1.id) in customer_user_data["licences"]

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

    def test_update_licences_to_customer_user_sends_notification(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        (customer_user, _) = customer.add_user(user, type="MANAGER", status="ACTIVE")

        licence_1 = LicenceFactory(orb=OrbFactory(), customer=customer, customer_user=customer_user)
        licence_2 = LicenceFactory(orb=OrbFactory(), customer=customer, customer_user=customer_user)
        licence_3 = LicenceFactory(orb=OrbFactory(), customer=customer)
        licence_4 = LicenceFactory(orb=OrbFactory(), customer=customer)

        client = api_client(user)
        url = reverse("customer-users-detail", args=[customer.id, user.uuid])

        response = client.get(url, format="json")
        customer_user_data = response.json()

        # at this point customer_user has licence_1 & licence_2
        # test that when we update this to licence_2 & licence_3
        # the user receives a notification that licence_1 was
        # revoked and licence_3 was added

        customer_user_data["licences"] = [licence_2.id, licence_3.id]
        response = client.put(url, customer_user_data, format="json")
        customer_user_data = response.json()

        email = mail.outbox[0]
        assert len(mail.outbox) == 1
        assert user.email in email.to
        assert str(licence_1.orb) in email.body
        assert str(licence_2.orb) not in email.body
        assert str(licence_3.orb) in email.body
        assert str(licence_4.orb) not in email.body

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
        assert content["licences"] == [
            f"All licences must come from customer {customer_1.name}."
        ]

        # I cannot add a licence w/ the same orb to a customer_user
        customer_user_data["licences"] = [str(licence_1.id), str(licence_3.id)]
        response = client.put(url, customer_user_data, format="json")
        content = response.json()
        assert status.is_client_error(response.status_code)
        assert content["licences"] == ["All licences must come from unique orbs."]

        # I cannot add a licence to a customer_user w/ an invalid id
        invalid_licence_id = shuffle_string(str(licence_1.id))
        customer_user_data["licences"] = [invalid_licence_id]
        response = client.put(url, customer_user_data, format="json")
        content = response.json()
        assert status.is_client_error(response.status_code)
        assert content["licences"] == [
            f"Object with id={ invalid_licence_id } does not exist."
        ]


@pytest.mark.django_db
class TestLicences:
    def test_licence_has_access(self, mock_storage):

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()

        licences = [
            LicenceFactory(orb=orb, customer=customer, access=i)
            for i in range(sum(Access) + 1)
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

        assert [licences.index(licence) for licence in Licence.objects.can_read()] == [1, 3, 5, 7]
        assert [licences.index(licence) for licence in Licence.objects.can_create()] == [2, 3, 6, 7]
        assert [licences.index(licence) for licence in Licence.objects.can_delete()] == [4, 5, 6, 7]


@pytest.mark.django_db
class TestDataScope:

    def test_matches_source_id(self):

        data_scope = DataScopeFactory(
            authority="authority",
            namespace="namespace",
            name="name",
            version="version",
        )
        data_scopes = DataScope.objects.all()

        valid_source_id = "authority/namespace/name/version"
        invalid_source_id = "some/other/source/id"
        assert data_scopes.matches_source_id(valid_source_id).count() == 1
        assert data_scopes.matches_source_id(invalid_source_id).count() == 0

        data_scope.version = "*"
        data_scope.save()

        valid_source_id = "authority/namespace/name/blahblahanything"
        invalid_source_id = "some/other/source/id"
        assert data_scopes.matches_source_id(valid_source_id).count() == 1
        assert data_scopes.matches_source_id(invalid_source_id).count() == 0

        data_scope.version = "fo?"
        data_scope.save()

        valid_source_id = "authority/namespace/name/foo"
        invalid_source_id = "authority/namespace/name/foobar"
        assert data_scopes.matches_source_id(valid_source_id).count() == 1
        assert data_scopes.matches_source_id(invalid_source_id).count() == 0

        with pytest.raises(ValueError):
            very_invalid_source_id = "some/malformed/id"
            data_scopes.matches_source_id(very_invalid_source_id)


@pytest.mark.django_db
class TestLicencedCustomer:

    def test_add_licences(self, mock_storage):

        N_LICENCES = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()

        customer.add_licences(orb, N_LICENCES)
        assert customer.licences.filter(orb=orb, customer_user__isnull=True).count() == N_LICENCES

    def test_assign_licences(self, mock_storage):

        N_LICENCES = N_USERS = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()
        for _ in range(N_USERS):
            customer.add_user(UserFactory(avatar=None), type="MEMBER", status="ACTIVE")

        customer.assign_licences(orb, customer.customer_users.all())
        assert customer.licences.filter(orb=orb, customer_user__isnull=False).count() == N_LICENCES

    def test_assign_licences_already_exist(self, mock_storage):

        N_LICENCES = N_USERS = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()
        customer.add_licences(orb, N_LICENCES)
        for _ in range(N_USERS):
            customer.add_user(UserFactory(avatar=None), type="MEMBER", status="ACTIVE")

        assert customer.licences.filter(orb=orb).count() == N_LICENCES

        customer.assign_licences(orb, customer.customer_users.all())
        assert customer.licences.filter(orb=orb).count() == N_USERS
        assert customer.licences.filter(orb=orb, customer_user__isnull=True).count() == 0

    def test_assign_licences_dont_add_missing(self, mock_storage):

        N_USERS = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()
        for _ in range(N_USERS):
            customer.add_user(UserFactory(avatar=None), type="MEMBER", status="ACTIVE")

        with pytest.raises(AssertionError):
             customer.assign_licences(orb, customer.customer_users.all(), add_missing=False)
        assert customer.licences.filter(orb=orb).count() == 0

    def test_assign_licences_dont_ignore_existing(self, mock_storage):

        N_USERS = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()
        for _ in range(N_USERS):
            customer.add_user(UserFactory(avatar=None), type="MEMBER", status="ACTIVE")

        customer.assign_licences(orb, customer.customer_users.all())
        with pytest.raises(AssertionError):
            customer.assign_licences(orb, customer.customer_users.all(), ignore_existing=False)
        assert customer.licences.filter(orb=orb).count() == N_USERS
