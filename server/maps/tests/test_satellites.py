import pytest
import urllib


from django.urls import resolve, reverse

from rest_framework import status
from rest_framework.test import APIClient

from astrosat_users.models import User
from astrosat_users.tests.utils import *

from .factories import *


@pytest.mark.django_db
def test_get_satellites():

    user = UserFactory()
    _, key = create_auth_token(user)

    satellites = [SatelliteFactory() for _ in range(10)]

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

    url = reverse("satellite-list")
    response = client.get(url)

    assert status.is_success(response.status_code)
    assert len(response.json()) == 10


@pytest.mark.django_db
def test_get_satellite_scenes():

    user = UserFactory()
    _, key = create_auth_token(user)

    scenes = [SatelliteSceneFactory() for _ in range(10)]

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

    url = reverse("satellite-scene-list")
    response = client.get(url)

    assert status.is_success(response.status_code)
    assert len(response.json()) == 10


@pytest.mark.django_db
def test_filter_satellite_scenes():

    user = UserFactory()
    _, key = create_auth_token(user)

    N_SATELLITES = 3
    N_SCENES_PER_SATELLITE = 10

    satellites = [SatelliteFactory() for _ in range(N_SATELLITES)]
    scenes = [
        SatelliteSceneFactory(satellite=satellites[i % N_SATELLITES])
        for i in range(N_SATELLITES * N_SCENES_PER_SATELLITE)
    ]

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

    # get all scenes...
    url = reverse("satellite-scene-list")
    response = client.get(url)
    assert status.is_success(response.status_code)
    assert len(response.json()) == N_SATELLITES * N_SCENES_PER_SATELLITE

    satellite_ids = [s.satellite_id for s in satellites]

    # filter on one satellite...
    url_params = urllib.parse.urlencode({"satellites": ",".join(satellite_ids[:1])})
    url = f"{reverse('satellite-scene-list')}?{url_params}"
    response = client.get(url)
    assert status.is_success(response.status_code)
    assert len(response.json()) == N_SCENES_PER_SATELLITE * 1

    # filter on two satellites...
    url_params = urllib.parse.urlencode({"satellites": ",".join(satellite_ids[:2])})
    url = f"{reverse('satellite-scene-list')}?{url_params}"
    response = client.get(url)
    assert status.is_success(response.status_code)
    assert len(response.json()) == N_SCENES_PER_SATELLITE * 2


@pytest.mark.django_db
def test_get_satellite_visualisations():

    user = UserFactory()
    _, key = create_auth_token(user)

    visualisations = [SatelliteVisualisationFactory() for _ in range(10)]

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

    url = reverse("satellite-visualisation-list")
    response = client.get(url)

    assert status.is_success(response.status_code)
    assert len(response.json()) == 10
