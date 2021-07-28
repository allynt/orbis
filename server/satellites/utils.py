import geopandas as gpd

DEFAULT_SRID = 4326


def project_geometry(geometry, crs=None):
    """
    projects a geometry object onto a different CRS; if no CRS is provided,
    uses GeoPanda's `estimate_utm_crs` fn to make its best guess.
    """
    # yapf: disable

    if geometry.srid is None:
        geometry.srid = DEFAULT_SRID

    if crs is None:
        crs = gpd.GeoSeries.from_wkt(
            [geometry.wkt],
            crs=geometry.srid
        ).estimate_utm_crs().srs

    projected_geometry = geometry.transform(crs, clone=True)

    return projected_geometry
