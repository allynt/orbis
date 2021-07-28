import pytest

from math import ceil, floor

from django.contrib.gis.geos import GEOSGeometry

from satellites.utils import project_geometry

# a known AOI...
TEST_AOI_WKT = "POLYGON ((-9.374606933593734 55.09846299265664, -9.374606933593734 54.57331045628759, -8.4297827148438 54.57331045628759, -8.4297827148438 55.09846299265664, -9.374606933593734 55.09846299265664))"
TEST_AOI_GEOMETRY = GEOSGeometry(TEST_AOI_WKT)
TEST_AOI_AREA = 3546179281.018879  # this is the raw value, not the rounded serialized value
TEST_AOI_SRID = 32629  # EPSG:32629 (WGS 84 / UTM Zone 29N)


def test_project_geometry():

    projected_geometry = project_geometry(TEST_AOI_GEOMETRY)
    projected_geometry_area = projected_geometry.area

    assert projected_geometry.srid == TEST_AOI_SRID
    assert projected_geometry_area >= floor(TEST_AOI_AREA)
    assert projected_geometry_area <= ceil(TEST_AOI_AREA)
