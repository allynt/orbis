import datetime
import pytest
import urllib

from django.contrib.gis.geos import GEOSGeometry, Polygon
from django.urls import resolve, reverse

from rest_framework import status

from astrosat_users.tests.utils import *

from orbis.serializers.serializers_satellites import SimplifiedGeometryField

from .factories import *


# this is a known working query for sentinel-2
# (it will return 8 products)
TEST_AOI_WKT = "POLYGON((3.05430080885967 51.89149650402203, 7.344251234505927 51.89149650402203, 7.344251234505927 52.23886675306355, 3.05430080885967 52.23886675306355, 3.05430080885967 51.89149650402203))"
TEST_AOI_GEOMETRY = GEOSGeometry(TEST_AOI_WKT)
TEST_AOI_QUERY_PARAM = SimplifiedGeometryField(
    geometry_class=TEST_AOI_GEOMETRY.__class__
).to_representation(TEST_AOI_GEOMETRY)
TEST_START_DATE = datetime.date(2016, 12, 7)
TEST_END_DATE = datetime.date(2016, 12, 10)


@pytest.mark.django_db
class TestSatellites:
    def test_get_satellites(self, user, api_client):

        N_RESOLUTIONS = 3
        N_VISUALISATIONS = 4
        N_SATELLITES = 10

        client = api_client(user)

        [SatelliteResolutionFactory() for _ in range(N_RESOLUTIONS)]
        [SatelliteVisualisationFactory() for _ in range(N_VISUALISATIONS)]
        [
            SatelliteFactory(
                resolutions=SatelliteResolution.objects.all(),
                visualisations=SatelliteVisualisation.objects.all(),
            )
            for _ in range(N_SATELLITES)
        ]

        url = reverse("satellite-list")
        response = client.get(url)
        satellites = response.json()

        assert status.is_success(response.status_code)
        assert len(satellites) == N_SATELLITES

        assert (sum(map(lambda x: len(x["resolutions"]), satellites)) == N_RESOLUTIONS * N_SATELLITES)
        assert ( sum(map(lambda x: len(x["visualisations"]), satellites)) == N_VISUALISATIONS * N_SATELLITES)


@pytest.mark.django_db
class TestSatelliteResults:
    def test_get_results(self, user, api_client):

        N_RESULTS = 10

        client = api_client(user)

        [SatelliteResultFactory(owner=user) for _ in range(N_RESULTS)]

        url = reverse("satellite-result-list")
        response = client.get(url)
        results = response.json()

        assert status.is_success(response.status_code)
        assert len(results) == N_RESULTS

    def test_filter_results_by_cloud_cover(self, user, api_client):

        N_RESULTS = 10

        client = api_client(user)

        # defining 10 results, each w/ a different cloud_cover
        [
            SatelliteResultFactory(owner=user, cloud_cover=i * 10)
            for i in range(N_RESULTS)
        ]

        # test the "exact" lookup expr...
        url_params = urllib.parse.urlencode({"cloud_cover": 0})
        url = f"{reverse('satellite-result-list')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        assert len(response.json()) == 1

        # test the "lte" lookup expr...
        url_params = urllib.parse.urlencode({"cloud_cover__lte": 10})
        url = f"{reverse('satellite-result-list')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        assert len(response.json()) == 2

        # test the "range" lookup expr...
        url_params = urllib.parse.urlencode({"cloud_cover__range": "20,30"})
        url = f"{reverse('satellite-result-list')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        assert len(response.json()) == 2

    def test_filter_results_by_satelite(self, user, api_client):

        N_SATELLITES = 3
        N_RESULTS_PER_SATELLITE = 2

        client = api_client(user)

        satellites = [SatelliteFactory() for _ in range(N_SATELLITES)]
        satellite_ids = [satellite.satellite_id for satellite in satellites]
        for satellite in satellites:
            SatelliteResultFactory.create_batch(
                N_RESULTS_PER_SATELLITE, owner=user, satellite=satellite
            )

        # filter on a single satellite
        url_params = urllib.parse.urlencode({"satellites": ",".join(satellite_ids[:1])})
        url = f"{reverse('satellite-result-list')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        results = response.json()
        assert len(results) == N_RESULTS_PER_SATELLITE
        assert all(map(lambda x: x["satellite"] in satellite_ids[:1], results))

        # filter on multiple satellites...
        url_params = urllib.parse.urlencode({"satellites": ",".join(satellite_ids[:2])})
        url = f"{reverse('satellite-result-list')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        results = response.json()
        assert len(results) == N_RESULTS_PER_SATELLITE * 2
        assert all(map(lambda x: x["satellite"] in satellite_ids[:2], results))

        # filter on an invalid satellite...
        url_params = urllib.parse.urlencode({"satellites": f"{shuffle_string(satellite_ids[0])}"})
        url = f"{reverse('satellite-result-list')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        results = response.json()
        assert len(results) == 0

    def test_filter_results_by_footprint(self, user, api_client):

        client = api_client(user)

        result = SatelliteResultFactory(owner=user)
        (xmin, ymin, xmax, ymax) = valid_bbox = result.footprint.extent
        invalid_bbox = Polygon.from_bbox(
            # (create a polygon that defintiely does not intersect the footprint)
            [
                xmin + (xmax - xmin),
                ymin + (ymax - ymin),
                xmax + (xmax - xmin),
                ymax + (ymax - ymin),
            ]
        ).extent

        # test a valid bbox...
        url_params = urllib.parse.urlencode({"footprint__bbox": ",".join(map(str, valid_bbox))})
        url = f"{reverse('satellite-result-list')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        assert len(response.json()) == 1

        # test a non-matching bbox...
        url_params = urllib.parse.urlencode({"footprint__bbox": ",".join(map(str, invalid_bbox))})
        url = f"{reverse('satellite-result-list')}?{url_params}"
        response = client.get(url)
        assert status.is_success(response.status_code)
        assert len(response.json()) == 0


# @pytest.mark.django_db
# def test_run_query(self, user, api_client):

#     client = api_client(user)

#     resolution = SatelliteResolutionFactory(name="free")
#     for satellite_id in ["sentinel-2"]:
#         SatelliteFactory(satellite_id=satellite_id, resolutions=[resolution])

#     query_params = urllib.parse.urlencode(
#         {
#             "satellites": ",".join(
#                 Satellite.objects.values_list("satellite_id", flat=True)
#             ),
#             "resolutions": ",".join(
#                 SatelliteResolution.objects.values_list("name", flat=True)
#             ),
#             "start_date": TEST_START_DATE,
#             "end_date": TEST_END_DATE,
#             "aoi": TEST_AOI_QUERY_PARAM,
#         }
#     )
#     url = f"{reverse('satellite-run-query')}?{query_params}"
#     response = client.get(url)

#     assert status.is_success(response.status_code)
