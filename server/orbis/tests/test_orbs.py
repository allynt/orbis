import pytest

from urllib.parse import urljoin

from django.conf import settings
from django.core import mail
from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat.tests.utils import *
from astrosat_users.tests.utils import *

from orbis.models import Licence, Orb

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

    def test_orb_has_no_terms(self, user, api_client, mock_storage):

        orb = OrbFactory()

        client = api_client(user)

        url = reverse("orbs-list")
        response = client.get(url)
        content = response.json()

        assert status.is_success(response.status_code)
        assert content[0]["terms_document"] == None

    def test_orb_has_terms(self, user, api_client, mock_storage):

        orb = OrbFactory()
        terms_document = DocumentFactory(type="TERMS", is_active=True)
        orb.documents.add(terms_document)

        client = api_client(user)

        url = reverse("orbs-list")
        response = client.get(url)
        content = response.json()

        assert status.is_success(response.status_code)
        assert content[0]["terms_document"] == urljoin(
            settings.MEDIA_URL, terms_document.file.name
        )


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
        customer_data["licences"] += [{
            "orb": orb.name
        } for _ in range(N_LICENCES)]

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licences"]) == N_LICENCES
        assert Licence.objects.count() == N_LICENCES
        for licence in Licence.objects.all():
            assert licence.orb == orb
            assert licence.customer == customer
            assert licence.access == Access.READ

    def test_remove_licences_from_customer(
        self, user, api_client, mock_storage
    ):
        N_LICENCES = 10

        # (again, the core licence will exist, but it is hidden by default)

        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licences = [
            LicenceFactory(customer=customer, orb=orb)
            for _ in range(N_LICENCES)
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
            {
                "orb": orb.name
            },
            {
                "orb": orb.name
            },
        ]
        customer_data["licences"][0]["access"] = Access.CREATE
        customer_data["licences"][1]["access"] = Access.CREATE

        response = client.put(url, customer_data, format="json")
        customer_data = response.json()

        assert len(customer_data["licences"]) == 4
        assert str(licences[0].id
                  ) not in map(lambda x: x["id"], customer_data["licences"])
        assert str(licences[1].id
                  ) not in map(lambda x: x["id"], customer_data["licences"])
        assert str(licences[2].id
                  ) in map(lambda x: x["id"], customer_data["licences"])
        assert str(licences[3].id
                  ) in map(lambda x: x["id"], customer_data["licences"])
        assert customer_data["licences"][0]["access"] == Access.CREATE
        assert customer_data["licences"][1]["access"] == Access.CREATE
        assert customer_data["licences"][2]["access"] == Access.READ
        assert customer_data["licences"][3]["access"] == Access.READ

    def test_add_licences_to_customer_user(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        (customer_user,
         _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
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
        assert customer.licences.filter(customer_user__isnull=False
                                       ).count() == 1

    def test_remove_licences_from_customer_user(
        self, user, api_client, mock_storage
    ):

        customer = CustomerFactory(logo=None)
        (customer_user,
         _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()
        licence = LicenceFactory(
            customer=customer, orb=orb, customer_user=customer_user
        )

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
        (customer_user,
         _) = customer.add_user(user, type="MANAGER", status="ACTIVE")
        orb = OrbFactory()

        licence_1 = LicenceFactory(
            orb=orb, customer=customer, customer_user=customer_user
        )
        licence_2 = LicenceFactory(
            orb=orb, customer=customer, customer_user=None
        )

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
        (customer_user,
         _) = customer.add_user(user, type="MANAGER", status="ACTIVE")

        licence_1 = LicenceFactory(
            orb=OrbFactory(), customer=customer, customer_user=customer_user
        )
        licence_2 = LicenceFactory(
            orb=OrbFactory(), customer=customer, customer_user=customer_user
        )
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
        (customer_user,
         _) = customer_1.add_user(user, type="MANAGER", status="ACTIVE")
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
        assert content["licences"] == [
            "All licences must come from unique orbs."
        ]

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
        #  0 (0000): nothing
        #  1 (0001): READ
        #  2 (0010): CREATE
        #  3 (0011): READ, CREATE
        #  4 (0100): DELETE
        #  5 (0101): READ, DELETE
        #  6 (0110): CREATE, DELETE
        #  7 (0111): READ, CREATE, DELETE
        #  8 (1000): UPDATE
        #  9 (1001): READ, UPDATE
        # 10 (1010): CREATE, UPDATE
        # 11 (1011): READ, CREATE, UPDATE
        # 12 (1100): DELETE, UPDATE
        # 13 (1101): READ, DELETE, UPDATE
        # 14 (1110): CREATE, DELETE, UPDATE
        # 15 (1111): READ, CREATE, DELETE, UPDATE

        assert [
            licences.index(licence) for licence in Licence.objects.can_read()
        ] == [1, 3, 5, 7, 9, 11, 13, 15]
        assert [
            licences.index(licence) for licence in Licence.objects.can_create()
        ] == [2, 3, 6, 7, 10, 11, 14, 15]
        assert [
            licences.index(licence) for licence in Licence.objects.can_delete()
        ] == [4, 5, 6, 7, 12, 13, 14, 15]
        assert [
            licences.index(licence) for licence in Licence.objects.can_update()
        ] == [8, 9, 10, 11, 12, 13, 14, 15]


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
        assert customer.licences.filter(orb=orb, customer_user__isnull=True
                                       ).count() == N_LICENCES

    def test_assign_licences(self, mock_storage):

        N_LICENCES = N_USERS = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()
        for _ in range(N_USERS):
            customer.add_user(
                UserFactory(avatar=None), type="MEMBER", status="ACTIVE"
            )

        customer.assign_licences(orb, customer.customer_users.all())
        assert customer.licences.filter(orb=orb, customer_user__isnull=False
                                       ).count() == N_LICENCES

    def test_assign_licences_already_exist(self, mock_storage):

        N_LICENCES = N_USERS = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()
        customer.add_licences(orb, N_LICENCES)
        for _ in range(N_USERS):
            customer.add_user(
                UserFactory(avatar=None), type="MEMBER", status="ACTIVE"
            )

        assert customer.licences.filter(orb=orb).count() == N_LICENCES

        customer.assign_licences(orb, customer.customer_users.all())
        assert customer.licences.filter(orb=orb).count() == N_USERS
        assert customer.licences.filter(orb=orb,
                                        customer_user__isnull=True).count() == 0

    def test_assign_licences_dont_add_missing(self, mock_storage):

        N_USERS = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()
        for _ in range(N_USERS):
            customer.add_user(
                UserFactory(avatar=None), type="MEMBER", status="ACTIVE"
            )

        with pytest.raises(AssertionError):
            customer.assign_licences(
                orb, customer.customer_users.all(), add_missing=False
            )
        assert customer.licences.filter(orb=orb).count() == 0

    def test_assign_licences_dont_ignore_existing(self, mock_storage):

        N_USERS = 10

        customer = CustomerFactory(logo=None)
        orb = OrbFactory()
        for _ in range(N_USERS):
            customer.add_user(
                UserFactory(avatar=None), type="MEMBER", status="ACTIVE"
            )

        customer.assign_licences(orb, customer.customer_users.all())
        with pytest.raises(AssertionError):
            customer.assign_licences(
                orb, customer.customer_users.all(), ignore_existing=False
            )
        assert customer.licences.filter(orb=orb).count() == N_USERS

    def test_default_licences_added(self, user, api_client, mock_storage):
        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")

        default_orb = OrbFactory(is_default=True, is_hidden=True)
        normal_orb = OrbFactory(is_default=False, is_hidden=False)

        new_user_data = {"email": "test@test.com", "name": "test name"}

        client = api_client(user)
        url = reverse("customer-users-list", args=[customer.id])
        response = client.post(
            url,
            {
                "licences": [],
                "user": {
                    "email": new_user_data["email"],
                    "name": new_user_data["name"]
                }
            },
            format="json"
        )
        assert status.is_success(response.status_code)

        assert customer.customer_users.count() == 2
        assert customer.customer_users.members().count() == 1

        new_customer_user = customer.customer_users.get(
            user__email=new_user_data["email"]
        )
        new_customer_user_licences = new_customer_user.licences.all()

        assert customer.licences.count() == 1
        assert default_orb in Orb.objects.filter(
            licences__in=new_customer_user_licences
        )
        assert normal_orb not in Orb.objects.filter(
            licences__in=new_customer_user_licences
        )

    def test_default_licences_removed(self, user, api_client, mock_storage):
        customer = CustomerFactory(logo=None)
        customer.add_user(user, type="MANAGER", status="ACTIVE")
        new_user = UserFactory(avatar=None)
        (new_customer_user,
         _) = customer.add_user(new_user, type="MEMBER", status="ACTIVE")

        default_orb = OrbFactory(is_default=True, is_hidden=True)
        normal_orb = OrbFactory(is_default=False, is_hidden=False)

        customer.assign_licences(
            default_orb, [new_customer_user],
            add_missing=True,
            ignore_existing=False
        )
        customer.assign_licences(
            normal_orb, [new_customer_user],
            add_missing=True,
            ignore_existing=False
        )

        assert customer.licences.count() == 2

        client = api_client(user)
        url = reverse(
            "customer-users-detail", args=[customer.id, new_user.uuid]
        )
        response = client.delete(url)
        assert status.is_success(response.status_code)

        remaining_licences = customer.licences.all()
        assert remaining_licences.count() == 1
        assert remaining_licences[0].customer_user == None

        assert default_orb not in Orb.objects.filter(
            licences__in=remaining_licences
        )
        assert normal_orb in Orb.objects.filter(licences__in=remaining_licences)

    def test_exclusive_licences_removed(self, user, mock_storage):

        customer = CustomerFactory(logo=None)
        customer_user, _ = customer.add_user(user, type="MANAGER", status="ACTIVE")

        exclusive_orb = OrbFactory(is_exclusive=True)
        normal_orb = OrbFactory(is_exclusive=False)

        customer.assign_licences(
            exclusive_orb, [customer_user],
            add_missing=True,
            ignore_existing=False
        )

        customer.assign_licences(
            normal_orb, [customer_user],
            add_missing=True,
            ignore_existing=False
        )

        customer.refresh_from_db()
        customer_user.refresh_from_db()

        customer_licences = customer.licences.all()
        customer_user_licences = customer_user.licences.all()

        assert customer_licences.count() == 2
        assert customer_user_licences.count() == 1

        assert exclusive_orb not in Orb.objects.filter(
            licences__in=customer_user_licences
        )
        assert normal_orb in Orb.objects.filter(
            licences__in=customer_user_licences
        )
        assert exclusive_orb in Orb.objects.filter(
            licences__in=customer_licences
        )
        assert normal_orb in Orb.objects.filter(licences__in=customer_licences)

    def test_exclusive_default_licences_deleted(self, user, mock_storage):

        customer = CustomerFactory(logo=None)
        customer_user, _ = customer.add_user(user, type="MANAGER", status="ACTIVE")

        exclusive_default_orb = OrbFactory(is_exclusive=True, is_default=True)
        normal_orb = OrbFactory(is_exclusive=False, is_default=False)

        customer.assign_licences(
            exclusive_default_orb, [customer_user],
            add_missing=True,
            ignore_existing=False
        )

        customer.assign_licences(
            normal_orb, [customer_user],
            add_missing=True,
            ignore_existing=False
        )

        customer.refresh_from_db()
        customer_user.refresh_from_db()

        customer_licences = customer.licences.all()
        customer_user_licences = customer_user.licences.all()

        assert customer_licences.count() == 1
        assert customer_user_licences.count() == 1

        assert exclusive_default_orb not in Orb.objects.filter(
            licences__in=customer_user_licences
        )
        assert normal_orb in Orb.objects.filter(
            licences__in=customer_user_licences
        )
        assert exclusive_default_orb not in Orb.objects.filter(
            licences__in=customer_licences
        )
        assert normal_orb in Orb.objects.filter(licences__in=customer_licences)


@pytest.mark.django_db
class TestOrbState:

    def test_orb_state_added_when_licence_assigned(self, user, mock_storage):

        orbis_user_profile = user.orbis_profile

        test_state = {
            "source_id": {
                "test": "state"
            }
        }

        customer = CustomerFactory(logo=None)
        customer_user, _ = customer.add_user(user, status="ACTIVE")
        orb = OrbFactory(default_orb_state=test_state)

        assert orbis_user_profile.orb_state == {}

        customer.assign_licences(
            orb, [customer_user],
            add_missing=True,
            ignore_existing=False
        )

        assert orbis_user_profile.orb_state == orb.default_orb_state


    def test_orb_state_not_overridden(self, user, mock_storage):

        orbis_user_profile = user.orbis_profile

        initial_state = {
            "source_id_1": {
                "test": "initial_state"
            }
        }

        test_state = {
            "source_id_1": {
                "test": "state"
            },
            "source_id_2": {
                "test": "state"
            }

        }

        customer = CustomerFactory(logo=None)
        customer_user, _ = customer.add_user(user, status="ACTIVE")
        orb = OrbFactory(default_orb_state=test_state)

        orbis_user_profile.orb_state = initial_state
        orbis_user_profile.save()

        customer.assign_licences(
            orb, [customer_user],
            add_missing=True,
            ignore_existing=False
        )

        # state should not be updated where it already exists
        assert orbis_user_profile.orb_state["source_id_1"] == initial_state["source_id_1"]
        assert orbis_user_profile.orb_state["source_id_2"] == test_state["source_id_2"]

    def test_orb_state_removed_when_licence_revoked(self, user):
        orbis_user_profile = user.orbis_profile

        test_state = {
            "source_id_1": {
                "test": "state"
            }
        }

        customer = CustomerFactory(logo=None)
        customer_user, _ = customer.add_user(user, status="ACTIVE")
        orb = OrbFactory(default_orb_state=test_state)

        licence = customer.assign_licences(
            orb, [customer_user],
            add_missing=True,
            ignore_existing=False
        )[0]

        licence.customer_user = None
        licence.save()

        orbis_user_profile.refresh_from_db()
        assert "source_id_1" not in orbis_user_profile.orb_state

    def test_orb_state_altered_when_licence_reassigned(self, api_client, mock_storage):

        user_1 = UserFactory()
        user_2 = UserFactory()

        test_state = {
            "source_id_1": {
                "test": "state"
            }
        }

        customer = CustomerFactory(logo=None)
        customer_user_1, _ = customer.add_user(user_1, type="MANAGER", status="ACTIVE")
        customer_user_2, _ = customer.add_user(user_2, type="MEMBER", status="ACTIVE")
        orb = OrbFactory(default_orb_state=test_state)

        customer.assign_licences(
            orb, [customer_user_1],
            add_missing=True,
            ignore_existing=False
        )

        client = api_client(user_1)
        url = reverse("customers-detail", args=[customer.id])
        customer_data = client.get(url).json()

        user_1.refresh_from_db()
        user_2.refresh_from_db()
        assert "source_id_1" in user_1.orbis_profile.orb_state
        assert "source_id_1" not in user_2.orbis_profile.orb_state

        customer_data["licences"][0]["customer_user"] = customer_user_2.pk
        client.put(url, customer_data, format="json")

        user_1.refresh_from_db()
        user_2.refresh_from_db()
        assert "source_id_1" not in user_1.orbis_profile.orb_state
        assert "source_id_1" in user_2.orbis_profile.orb_state


    def test_orb_state_removed_when_licence_deleted(self, user, mock_storage):
        orbis_user_profile = user.orbis_profile

        initial_state = {
            "source_id_2": {
                "test": "initial_state"
            }
        }

        test_state = {
            "source_id_1": {
                "test": "state"
            }
        }

        customer = CustomerFactory(logo=None)
        customer_user, _ = customer.add_user(user, status="ACTIVE")
        orb = OrbFactory(default_orb_state=test_state)

        orbis_user_profile.orb_state = initial_state
        orbis_user_profile.save()

        licence = customer.assign_licences(
            orb, [customer_user],
            add_missing=True,
            ignore_existing=False
        )[0]

        licence.delete()
        orbis_user_profile.refresh_from_db()
        assert "source_id_2" in orbis_user_profile.orb_state
        assert "source_id_1" not in orbis_user_profile.orb_state
