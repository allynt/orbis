import datetime
import json
import pytest
import urllib

from django.contrib.gis.geos import GEOSGeometry, Polygon
from django.urls import resolve, reverse

from rest_framework import status

from astrosat.tests.utils import shuffle_string

from astrosat_users.tests.utils import *
from orbis.tests.factories import OrbFactory, CustomerFactory

from satellites.serializers import SimplifiedGeometryField

from .factories import *

# this is a known working query for sentinel-2
# (it will return 8 products)
TEST_AOI_WKT = "POLYGON((3.05430080885967 51.89149650402203, 7.344251234505927 51.89149650402203, 7.344251234505927 52.23886675306355, 3.05430080885967 52.23886675306355, 3.05430080885967 51.89149650402203))"
TEST_AOI_GEOMETRY = GEOSGeometry(TEST_AOI_WKT)
TEST_AOI_QUERY_PARAM = SimplifiedGeometryField(
    geometry_class=TEST_AOI_GEOMETRY.__class__
).to_representation(TEST_AOI_GEOMETRY)
TEST_START_DATE = datetime.datetime(2016, 12, 7)
TEST_END_DATE = datetime.datetime(2016, 12, 10)


@pytest.mark.django_db
class TestSatellites:
    def test_get_satellites(self, user, api_client):

        N_VISUALISATIONS = 4
        N_SATELLITES = 10

        client = api_client(user)

        [SatelliteVisualisationFactory() for _ in range(N_VISUALISATIONS)]
        [
            SatelliteFactory(
                visualisations=SatelliteVisualisation.objects.all(),
            ) for _ in range(N_SATELLITES)
        ]

        url = reverse("satellite-list")
        response = client.get(url)
        satellites = response.json()

        assert status.is_success(response.status_code)
        assert len(satellites) == N_SATELLITES

        assert (
            sum(map(lambda x: len(x["visualisations"]),
                    satellites)) == N_VISUALISATIONS * N_SATELLITES
        )


# NOTE: THESE TESTS ARE COMMENTED-OUT B/C I NO LONGER SAVE SatelliteResults
# ONCE I'M CERTAIN THAT THIS IS THE CORRECT APPROACH I WILL DELETE THEM
# @pytest.mark.django_db
# class TestSatelliteResults:
#     def test_get_result(self, user, api_client):
#         """
#         Tests that I can get a single result using scene_id.
#         """

#         client = api_client(user)

#         satellite_result = SatelliteResultFactory(owner=user)
#         url = reverse(
#             "satellite-result-detail",
#             kwargs={"scene_id": satellite_result.scene_id}
#         )
#         response = client.get(url)
#         result = response.json()

#         assert status.is_success(response.status_code)
#         assert result["id"] == satellite_result.scene_id

#     def test_delete_result(self, user, api_client):
#         """
#         Tests that I can delete a single result using scene_id.
#         """

#         client = api_client(user)

#         satellite_result = SatelliteResultFactory(owner=user)
#         assert SatelliteResult.objects.filter(
#             scene_id=satellite_result.scene_id
#         ).count() == 1

#         url = reverse(
#             "satellite-result-detail",
#             kwargs={"scene_id": satellite_result.scene_id}
#         )
#         response = client.delete(url)

#         assert status.is_success(response.status_code)
#         assert SatelliteResult.objects.filter(
#             scene_id=satellite_result.scene_id
#         ).count() == 0

#     def test_get_results(self, user, api_client):

#         N_RESULTS = 10

#         client = api_client(user)

#         [SatelliteResultFactory(owner=user) for _ in range(N_RESULTS)]

#         url = reverse("satellite-result-list")
#         response = client.get(url)
#         results = response.json()

#         assert status.is_success(response.status_code)
#         assert len(results) == N_RESULTS

#     def test_filter_results_by_cloud_cover(self, user, api_client):

#         N_RESULTS = 10

#         client = api_client(user)

#         # defining 10 results, each w/ a different cloud_cover
#         [
#             SatelliteResultFactory(owner=user, cloud_cover=i * 10)
#             for i in range(N_RESULTS)
#         ]

#         # test the "exact" lookup expr...
#         url_params = urllib.parse.urlencode({"cloud_cover": 0})
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         assert len(response.json()) == 1

#         # test the "lte" lookup expr...
#         url_params = urllib.parse.urlencode({"cloud_cover__lte": 10})
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         assert len(response.json()) == 2

#         # test the "range" lookup expr...
#         url_params = urllib.parse.urlencode({"cloud_cover__range": "20,30"})
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         assert len(response.json()) == 2

#     def test_filter_results_by_satellite(self, user, api_client):

#         N_SATELLITES = 3
#         N_RESULTS_PER_SATELLITE = 2

#         client = api_client(user)

#         satellites = [SatelliteFactory() for _ in range(N_SATELLITES)]
#         satellite_ids = [satellite.satellite_id for satellite in satellites]
#         for satellite in satellites:
#             SatelliteResultFactory.create_batch(
#                 N_RESULTS_PER_SATELLITE, owner=user, satellite=satellite
#             )

#         # filter on a single satellite
#         url_params = urllib.parse.urlencode({
#             "satellites": ",".join(satellite_ids[:1])
#         })
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         results = response.json()
#         assert len(results) == N_RESULTS_PER_SATELLITE
#         assert all(map(lambda x: x["satellite"] in satellite_ids[:1], results))

#         # filter on multiple satellites...
#         url_params = urllib.parse.urlencode({
#             "satellites": ",".join(satellite_ids[:2])
#         })
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         results = response.json()
#         assert len(results) == N_RESULTS_PER_SATELLITE * 2
#         assert all(map(lambda x: x["satellite"] in satellite_ids[:2], results))

#         # filter on an invalid satellite...
#         url_params = urllib.parse.urlencode({
#             "satellites": f"{shuffle_string(satellite_ids[0])}"
#         })
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         results = response.json()
#         assert len(results) == 0

#     def test_filter_results_by_tier(self, user, api_client):

#         N_TIERS = 3
#         N_RESULTS_PER_TIER = 2

#         client = api_client(user)

#         tiers = [SatelliteTierFactory() for _ in range(N_TIERS)]
#         tier_names = [tier.name for tier in tiers]
#         for tier in tiers:
#             SatelliteResultFactory.create_batch(
#                 N_RESULTS_PER_TIER, owner=user, tier=tier
#             )

#         # filter on a single tier
#         url_params = urllib.parse.urlencode({"tiers": ",".join(tier_names[:1])})
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         results = response.json()
#         assert len(results) == N_RESULTS_PER_TIER
#         assert all(map(lambda x: x["tier"] in tier_names[:1], results))

#         # filter on multiple tiers...
#         url_params = urllib.parse.urlencode({"tiers": ",".join(tier_names[:2])})
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         results = response.json()
#         assert len(results) == N_RESULTS_PER_TIER * 2
#         assert all(map(lambda x: x["tier"] in tier_names[:2], results))

#         # filter on an invalid tier...
#         url_params = urllib.parse.urlencode({
#             "tiers": f"{shuffle_string(tier_names[0])}"
#         })
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         results = response.json()
#         assert len(results) == 0

#     def test_filter_results_by_footprint(self, user, api_client):

#         client = api_client(user)

#         result = SatelliteResultFactory(owner=user)
#         (xmin, ymin, xmax, ymax) = valid_bbox = result.footprint.extent
#         invalid_bbox = Polygon.from_bbox(
#             # (create a polygon that definitely does not intersect the footprint)
#             [
#                 xmin + (xmax - xmin) + 1,
#                 ymin + (ymax - ymin) + 1,
#                 xmax + (xmax - xmin) + 1,
#                 ymax + (ymax - ymin) + 1,
#             ]
#         ).extent

#         # test a valid bbox...
#         url_params = urllib.parse.urlencode({
#             "footprint__bbox": ",".join(map(str, valid_bbox))
#         })
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         assert len(response.json()) == 1

#         # test a non-matching bbox...
#         url_params = urllib.parse.urlencode({
#             "footprint__bbox": ",".join(map(str, invalid_bbox))
#         })
#         url = f"{reverse('satellite-result-list')}?{url_params}"
#         response = client.get(url)
#         assert status.is_success(response.status_code)
#         assert len(response.json()) == 0


@pytest.mark.django_db
class TestSatelliteQueries:
    def test_satellite_query_permission(self, user, api_client):
        """
        Tests that only users w/ a licence to an orb w/ the "satellite" feature
        can run access the run_satellite_query view
        """

        orb = OrbFactory()
        assert orb.features == []

        satellite = SatelliteFactory()
        assert satellite.adapter_name == "mock-adapter"

        customer = CustomerFactory(logo=None)
        customer.add_user(user)
        customer.assign_licences(orb, customer.customer_users.all())

        url = reverse("satellite-run-query")
        client = api_client(user)

        test_data = {
            "satellites": [satellite.satellite_id],
            "start_date": (datetime.datetime.now() - datetime.timedelta(1)).isoformat(),
            "end_date": (datetime.datetime.now()).isoformat(),
            "aoi": [
                [-7.730434, 55.290074],
                [-7.730434, 54.827249],
                [-7.160366, 54.827249],
                [-7.160366, 55.290074],
                [-7.730434, 55.290074],
            ],
        }  # yapf: disable

        response = client.post(url, data=test_data, format="json")
        assert status.is_client_error(response.status_code)
        assert response.json(
        )["detail"] == "You do not have a licence to run a Satellite Query."

        orb.features.append("satellites")
        orb.save()

        response = client.post(url, data=test_data, format="json")
        assert status.is_success(response.status_code)
