""" Test AOIs. """
import json
import os

import pytest
from django.contrib.gis.geos import GEOSGeometry, Point, Polygon
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from factory.faker import Faker as FactoryFaker  # note I use FactoryBoy's wrapper of Faker when defining factory fields
from rest_framework import status
from rest_framework.test import APIClient

from astrosat.tests.utils import shuffle_string

from astrosat.tests.providers import GeometryProvider
from astrosat_users.tests.utils import *
from maps.models import Aoi
from maps.serializers import AoiSerializer
from maps.serializers.serializers_aois import AoiSerializer

from astrosat.tests.providers import GeometryProvider

from .factories import *

TEST_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

FactoryFaker.add_provider(GeometryProvider)

SRID = 4326


@pytest.mark.django_db
class TestAoiModel:
    """ Test to prove the AOI serializer. """
    def test_aoi_point_creation_wkt(self):
        """ Test model can take WKT POINT geometry. """
        user = UserFactory()
        geometry = "POINT(-3.165556 55.961667)"
        thumbnail = SimpleUploadedFile(
            name="test_thumbnail.png",
            content=open(
                os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb'
            ).read(),
            content_type='image/png'
        )

        aoi = Aoi.objects.create(
            name="Test AOI",
            description="Test AOI Description",
            owner=user,
            geometry=geometry,
            thumbnail=thumbnail
        )

        assert isinstance(aoi.geometry, Point)
        assert not isinstance(aoi.geometry, Polygon)

    def test_aoi_point_creation_geom(self):
        """ Test model can take Geom Point geometry. """
        user = UserFactory()
        geometry = Point(-3.165556, 55.961667, srid=SRID)
        thumbnail = SimpleUploadedFile(
            name="test_thumbnail.png",
            content=open(
                os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb'
            ).read(),
            content_type='image/png'
        )

        aoi = Aoi.objects.create(
            name="Test AOI",
            description="Test AOI Description",
            owner=user,
            geometry=geometry,
            thumbnail=thumbnail
        )

        assert isinstance(aoi.geometry, Point)
        assert not isinstance(aoi.geometry, Polygon)

    def test_aoi_polygon_creation_wkt(self):
        """ Test model can take WKT POLYGON geometry. """
        user = UserFactory()
        geometry = "POLYGON((-3.1650924682617188 55.96235373501369, -3.166186809539795 55.96207748876014, -3.1653928756713867 55.9612727601746, -3.164534568786621 55.96152499033761, -3.1650924682617188 55.96235373501369))"
        thumbnail = SimpleUploadedFile(
            name="test_thumbnail.png",
            content=open(
                os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb'
            ).read(),
            content_type='image/png'
        )

        aoi = Aoi.objects.create(
            name="Test AOI",
            description="Test AOI Description",
            owner=user,
            geometry=geometry,
            thumbnail=thumbnail
        )

        assert isinstance(aoi.geometry, Polygon)
        assert not isinstance(aoi.geometry, Point)

    def test_aoi_polygon_creation_geom(self):
        """ Test model can take geom Polygon geometry. """
        user = UserFactory()
        geometry = Polygon([[-3.1650924682617188, 55.96235373501369], [
            -3.166186809539795, 55.96207748876014
        ], [-3.1653928756713867, 55.9612727601746], [
            -3.164534568786621, 55.96152499033761
        ], [-3.1650924682617188, 55.96235373501369]],
                           srid=SRID)
        thumbnail = SimpleUploadedFile(
            name="test_thumbnail.png",
            content=open(
                os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb'
            ).read(),
            content_type='image/png'
        )

        aoi = Aoi.objects.create(
            name="Test AOI",
            description="Test AOI Description",
            owner=user,
            geometry=geometry,
            thumbnail=thumbnail
        )

        assert isinstance(aoi.geometry, Polygon)
        assert not isinstance(aoi.geometry, Point)


@pytest.mark.django_db
class TestAoiSerializer:
    def test_serialization_of_wkt_point(self):
        user = UserFactory()
        geometry = "POINT(-3.165556 55.961667)"
        thumbnail = SimpleUploadedFile(
            name="test_thumbnail.png",
            content=open(
                os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb'
            ).read(),
            content_type='image/png'
        )

        aoi = Aoi(
            name="Test AOI Serialization Name",
            description="Test AOI Serialization Description",
            owner=user,
            geometry=geometry,
            thumbnail=thumbnail
        )

        serializer = AoiSerializer(instance=aoi)
        geom = json.loads(serializer.data["geometry"])

        assert geom["type"] == "Point"

    def test_serialization_of_geom_point(self):
        user = UserFactory()
        geometry = Point(-3.165556, 55.961667, srid=SRID)
        thumbnail = SimpleUploadedFile(
            name="test_thumbnail.png",
            content=open(
                os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb'
            ).read(),
            content_type='image/png'
        )

        aoi = Aoi(
            name="Test AOI Serialization Name",
            description="Test AOI Serialization Description",
            owner=user,
            geometry=geometry,
            thumbnail=thumbnail
        )

        serializer = AoiSerializer(instance=aoi)
        geom = json.loads(serializer.data["geometry"])

        assert geom["type"] == "Point"

    def test_serialization_of_wkt_polygon(self):
        user = UserFactory()
        geometry = "POLYGON((-3.1650924682617188 55.96235373501369, -3.166186809539795 55.96207748876014, -3.1653928756713867 55.9612727601746, -3.164534568786621 55.96152499033761, -3.1650924682617188 55.96235373501369))"
        thumbnail = SimpleUploadedFile(
            name="test_thumbnail.png",
            content=open(
                os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb'
            ).read(),
            content_type='image/png'
        )

        aoi = Aoi(
            name="Test AOI Serialization Name",
            description="Test AOI Serialization Description",
            owner=user,
            geometry=geometry,
            thumbnail=thumbnail
        )

        serializer = AoiSerializer(instance=aoi)
        geom = json.loads(serializer.data["geometry"])

        assert geom["type"] == "Polygon"

    def test_serialization_of_geom_polygon(self):
        user = UserFactory()
        geometry = Polygon([[-3.1650924682617188, 55.96235373501369], [
            -3.166186809539795, 55.96207748876014
        ], [-3.1653928756713867, 55.9612727601746], [
            -3.164534568786621, 55.96152499033761
        ], [-3.1650924682617188, 55.96235373501369]],
                           srid=SRID)
        thumbnail = SimpleUploadedFile(
            name="test_thumbnail.png",
            content=open(
                os.path.join(TEST_DATA_DIR, "test_thumbnail.png"), 'rb'
            ).read(),
            content_type='image/png'
        )

        aoi = Aoi(
            name="Test AOI Serialization Name",
            description="Test AOI Serialization Description",
            owner=user,
            geometry=geometry,
            thumbnail=thumbnail
        )

        serializer = AoiSerializer(instance=aoi)
        geom = json.loads(serializer.data["geometry"])

        assert geom["type"] == "Polygon"

    def test_deserialization_of_point(self):
        aoi = AoiFactory.build(
            owner=UserFactory(avatar=None),
            geometry=Point(-3.165556, 55.961667, srid=SRID)
        )  # TODO: ADD GEOMETRY TO CONSTRUCTOR

        aoi_data = {
            "name": aoi.name,
            "description": aoi.description,
            "owner": aoi.owner.uuid,
            "geometry": aoi.geometry.geojson,
        }

        serializer = AoiSerializer(data=aoi_data)

        assert serializer.is_valid()
        geom = serializer.validated_data["geometry"]

        assert isinstance(geom, Point)
        assert not isinstance(geom, Polygon)

    def test_deserialization_of_polygon(self):
        geometry = Polygon([[-3.1650924682617188, 55.96235373501369], [
            -3.166186809539795, 55.96207748876014
        ], [-3.1653928756713867, 55.9612727601746], [
            -3.164534568786621, 55.96152499033761
        ], [-3.1650924682617188, 55.96235373501369]],
                           srid=SRID)

        aoi = AoiFactory.build(
            owner=UserFactory(avatar=None), geometry=geometry
        )  # TODO: ADD GEOMETRY TO CONSTRUCTOR

        aoi_data = {
            "name": aoi.name,
            "description": aoi.description,
            "owner": aoi.owner.uuid,
            "geometry": aoi.geometry.geojson,
        }

        serializer = AoiSerializer(data=aoi_data)

        assert serializer.is_valid()
        geom = serializer.validated_data["geometry"]

        assert isinstance(geom, Polygon)
        assert not isinstance(geom, Point)


@pytest.mark.django_db
class TestAoiViewSet:
    """ Test to prove the AOI viewset. """
    def test_list_aois(self):
        """ Test getting a list of AOIs for a particular user. """
        user = UserFactory()
        _, key = create_auth_token(user)

        point_geometry = Point(-3.165556, 55.961667, srid=SRID)
        polygon_geometry = Polygon([[-3.1650924682617188, 55.96235373501369], [
            -3.166186809539795, 55.96207748876014
        ], [-3.1653928756713867, 55.9612727601746], [
            -3.164534568786621, 55.96152499033761
        ], [-3.1650924682617188, 55.96235373501369]],
                                   srid=SRID)

        aois = [
            AoiFactory(owner=user, geometry=point_geometry) if i %
            2 == 0 else AoiFactory(owner=user, geometry=polygon_geometry)
            for i in range(10)
        ]

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("aoi-list")
        response = client.get(url)
        content = response.json()

        assert status.is_success(response.status_code)
        assert len(content) == 10

        points = [
            aoi
            for aoi in content if json.loads(aoi["geometry"])["type"] == "Point"
        ]
        assert len(points) == 5
        polygons = [
            aoi for aoi in content
            if json.loads(aoi["geometry"])["type"] == "Polygon"
        ]
        assert len(polygons) == 5

    def test_get_aoi(self):
        """ Test getting a single AOI for a particular user. """
        user = UserFactory()
        _, key = create_auth_token(user)

        point_geometry = Point(-3.165556, 55.961667, srid=SRID)
        aoi = AoiFactory(owner=user, geometry=point_geometry)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("aoi-detail", kwargs={"pk": aoi.pk})
        response = client.get(url)

        assert status.is_success(response.status_code)

    def test_create_point_geometry_aoi(self):
        """ Test creating an AOI using a point geometry. """
        user = UserFactory()
        _, key = create_auth_token(user)

        point_geometry = Point(-3.165556, 55.961667, srid=SRID)
        aoi = AoiFactory.build(owner=user, geometry=point_geometry)

        aoi_data = {
            "name": aoi.name,
            "description": aoi.description or "",
            "geometry": GEOSGeometry(aoi.geometry).geojson,
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("aoi-list")
        response = client.post(url, aoi_data, format="multipart")

        assert status.is_success(response.status_code)
        assert Aoi.objects.count() == 1

        new_aoi = Aoi.objects.first()

        assert new_aoi.name == aoi.name
        assert new_aoi.geometry == aoi.geometry

    def test_create_point_wkt_aoi(self):
        """ Test creating an AOI using a point WKT. """
        user = UserFactory()
        _, key = create_auth_token(user)

        point_geometry = "POINT(-3.165556 55.961667)"
        aoi = AoiFactory.build(owner=user, geometry=point_geometry)

        aoi_data = {
            "name": aoi.name,
            "description": aoi.description or "",
            "geometry": GEOSGeometry(aoi.geometry).geojson,
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("aoi-list")
        response = client.post(url, aoi_data, format="multipart")

        assert status.is_success(response.status_code)
        assert Aoi.objects.count() == 1

        new_aoi = Aoi.objects.first()

        assert new_aoi.name == aoi.name
        assert new_aoi.geometry == aoi.geometry

    def test_create_polygon_geometry_aoi(self):
        """ Test creating an AOI using a polygon geometry. """
        user = UserFactory()
        _, key = create_auth_token(user)

        polygon_geometry = Polygon([[-3.1650924682617188, 55.96235373501369], [
            -3.166186809539795, 55.96207748876014
        ], [-3.1653928756713867, 55.9612727601746], [
            -3.164534568786621, 55.96152499033761
        ], [-3.1650924682617188, 55.96235373501369]],
                                   srid=SRID)
        aoi = AoiFactory.build(owner=user, geometry=polygon_geometry)

        aoi_data = {
            "name": aoi.name,
            "description": aoi.description or "",
            "geometry": GEOSGeometry(aoi.geometry).geojson,
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("aoi-list")
        response = client.post(url, aoi_data, format="multipart")

        assert status.is_success(response.status_code)
        assert Aoi.objects.count() == 1

        new_aoi = Aoi.objects.first()

        assert new_aoi.name == aoi.name
        assert new_aoi.geometry.wkt == aoi.geometry.wkt

    def test_create_polygon_wkt_aoi(self):
        """ Test creating an AOI using a polygon WKT. """
        user = UserFactory()
        _, key = create_auth_token(user)

        polygon_geometry = "POLYGON((-3.1650924682617188 55.96235373501369, -3.166186809539795 55.96207748876014, -3.1653928756713867 55.9612727601746, -3.164534568786621 55.96152499033761, -3.1650924682617188 55.96235373501369))"
        aoi = AoiFactory.build(owner=user, geometry=polygon_geometry)

        aoi_data = {
            "name": aoi.name,
            "description": aoi.description or "",
            "geometry": GEOSGeometry(aoi.geometry).geojson,
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("aoi-list")
        response = client.post(url, aoi_data, format="multipart")

        assert status.is_success(response.status_code)
        assert Aoi.objects.count() == 1

        new_aoi = Aoi.objects.first()

        assert new_aoi.name == aoi.name
        assert new_aoi.geometry.wkt == aoi.geometry.wkt

    def test_delete_aoi(self):
        """ Test deleting an AOI. """
        user = UserFactory()
        _, key = create_auth_token(user)

        point_geometry = Point(-3.165556, 55.961667, srid=SRID)
        aoi = AoiFactory(owner=user, geometry=point_geometry)

        assert Aoi.objects.count() == 1

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("aoi-detail", kwargs={"pk": aoi.pk})
        response = client.delete(url)

        assert status.is_success(response.status_code)
        assert Aoi.objects.count() == 0

    def test_updating_aoi(self):
        """ Test updating an existing AOI. """
        user = UserFactory()
        _, key = create_auth_token(user)

        aoi = AoiFactory.create(owner=user)

        new_name = shuffle_string(aoi.name).strip()
        new_geometry = Point(-3.165556, 55.961667, srid=SRID)

        aoi_data = {
            "name": new_name,
            "description": aoi.description,
            "geometry": GEOSGeometry(new_geometry).geojson,
        }

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {key}")

        url = reverse("aoi-detail", kwargs={"pk": aoi.pk})
        response = client.put(url, aoi_data, format="multipart")

        assert status.is_success(response.status_code)

        aoi.refresh_from_db()

        assert aoi.name == new_name
        assert aoi.geometry == new_geometry
