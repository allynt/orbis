from collections import OrderedDict
from itertools import filterfalse
import re

from django.conf import settings

from sentinelsat import SentinelAPI

from .adapters_base import BaseSatelliteAdapter
"""
Uses the sentinelsat library provided by Copernicus to access sentinel-2 data
More information available at:
https://sentinelsat.readthedocs.io/en/stable/api.html
https://scihub.copernicus.eu/twiki/do/view/SciHubUserGuide/FullTextSearch?redirectedfrom=SciHubUserGuide.3FullTextSearch
"""

SENTINEL2_PROPERTIES = {
    # list of the properties to extract to metadata from sentinel-2 products
    "summary": "Summary",
    "instrumentname": "Name of the instrument",
    "sensoroperationalmode": "Operational mode of the sensor",
    "direction": "Orbit direction",
    "producttype": "Product type",
    "cloudcoverpercentage": "Cloud coverage [%]",
}

FILENAME_PARTS = OrderedDict([
    ("mission", "S2A|S2B"),
    ("processing_level", "MSI.{3}"),
    ("timestamp", r"\d{8}T\d{6}"),
    ("processing_baseline_number", "N.{4}"),
    ("relative_orbit_number", "R.{3}"),
    ("tile_number", "T.{5}"),
    ("product_discriminator", ".*"),
    ("product_format", ".*"),
])

FILENAME_REGEX = re.compile(
    r"^(?P<mission>{mission})_(?P<processing_level>{processing_level})_(?P<timestamp>{timestamp})_(?P<processing_baseline_number>{processing_baseline_number})_(?P<relative_orbit_number>{relative_orbit_number})_(?P<tile_number>{tile_number})_(?P<product_discriminator>{product_discriminator})\.(?P<product_format>{product_format})$"
    .format(**FILENAME_PARTS)
)


class Sentinel2Adapter(BaseSatelliteAdapter):

    name = "sentinel-2"

    api = None

    def __init__(self, *args, **kwargs):
        self.api = SentinelAPI(
            settings.COPERNICUS_USERNAME,
            settings.COPERNICUS_PASSWORD,
        )

    def run_query(self, **kwargs):

        # yapf: disable

        from satellites.models import SatelliteResult

        query_params = kwargs

        products = self.api.query(
            area=query_params["aoi"].wkt,
            area_relation="Intersects",
            platformname="Sentinel-2",
            # L2A was only added 20160612 (so rather than add a filter
            # to the query here, I manually filter the results below)
            # producttype="S2MSI2A",
            order_by="ingestiondate",
            offset=0,
            date=(
                query_params["start_date"],
                query_params["end_date"],
            ),
        )

        # add some extra info to the products
        # (in order to filter via this info below)
        parsed_products = [
            dict(
                parsed_filename=FILENAME_REGEX.match(
                    product["filename"]
                ).groupdict(),
                **product
            )
            for product in products.values()
        ]

        # remove "L1C" products if there is a corresponding "L2A" product
        filtered_products = filterfalse(
            lambda x: (
                x["parsed_filename"]["processing_level"] == "MSIL1C" and
                # using "next" will break out of the loop as soon as there is a matching element
                # this makes nested looping a bit more efficient
                next(
                    (
                        product for product in parsed_products if (
                            product["parsed_filename"]["processing_level"] == "MSIL2A" and
                            all(
                                product["parsed_filename"][filename_part] == x["parsed_filename"][filename_part]
                                for filename_part in [
                                    "mission",
                                    # note I don't want "processing_level" to match x,
                                    # since I explicitly check that it equals "L2A" above
                                    # "processing_level",
                                    "timestamp",
                                    "processing_baseline_number",
                                    "relative_orbit_number",
                                    "tile_number",
                                    # note I don't care about "product_discriminator"
                                    # "product_discriminator",
                                    "product_format",
                                ]
                            )
                        )
                    ),
                    None
                )
            ),
            parsed_products
        )

        results = [
            SatelliteResult(
                # set some attributes based on the adapter...
                satellite=query_params["satellite"],
                # set some attributes directly from the product...
                scene_id=product["identifier"],
                created=product["endposition"],
                footprint=product["footprint"],
                cloud_cover=product["cloudcoverpercentage"],
                # extract everything I can into metadata...
                metadata={
                    SENTINEL2_PROPERTIES[k]: v
                    for k, v in product.items()
                    if k in SENTINEL2_PROPERTIES
                },
                # store everything else as raw_data...
                raw_data=product,
            )
            for product in filtered_products
        ]

        return results


# sample web request:
# https://scihub.copernicus.eu/dhus/api/stub/products?filter=
# (%20footprint:%22Intersects(POLYGON((3.05430080885967%2051.89149650402203,7.344251234505927%2051.89149650402203,7.344251234505927%2052.23886675306355,3.05430080885967%2052.23886675306355,3.05430080885967%2051.89149650402203)))%22%20)%20AND%20(%20%20(platformname:Sentinel-2))&offset=0&limit=25&sortedby=ingestiondate&order=desc

# sample output:
# {
#   'ef5befd0-0418-4725-9c30-75d28dce673a': {
#     'title': 'S2A_MSIL1C_20161207T105432_N0204_R051_T31UET_20161207T105428',
#     'link': "https://scihub.copernicus.eu/apihub/odata/v1/Products('ef5befd0-0418-4725-9c30-75d28dce673a')/$value",
#     'link_alternative': "https://scihub.copernicus.eu/apihub/odata/v1/Products('ef5befd0-0418-4725-9c30-75d28dce673a')/",
#     'link_icon': "https://scihub.copernicus.eu/apihub/odata/v1/Products('ef5befd0-0418-4725-9c30-75d28dce673a')/Products('Quicklook')/$value",
#     'summary': 'Date: 2016-12-07T10:54:32.026Z, Instrument: MSI, Mode: , Satellite: Sentinel-2, Size: 736.49 MB',
#     'ingestiondate': datetime.datetime(2016,12,8,10,43,43,365000),
#     'beginposition': datetime.datetime(2016,12,7,10,54,32,26000),
#     'endposition': datetime.datetime(2016,12,7,10,54,32,26000),
#     'orbitnumber': 7627,
#     'relativeorbitnumber': 51,
#     'cloudcoverpercentage': 97.5818,
#     'filename': 'S2A_MSIL1C_20161207T105432_N0204_R051_T31UET_20161207T105428.SAFE',
#     'gmlfootprint': '<gml:Polygon srsName="http://www.opengis.net/gml/srs/epsg.xml#4326" xmlns:gml="http://www.opengis.net/gml">\n   <gml:outerBoundaryIs>\n      <gml:LinearRing>\n         <gml:coordinates>52.3504731573947,2.999706370881351 52.3394848521498,4.611384362792962 51.35263389325745,4.576518664211577 51.36324170782969,2.999712727409819 52.3504731573947,2.999706370881351 52.3504731573947,2.999706370881351</gml:coordinates>\n      </gml:LinearRing>\n   </gml:outerBoundaryIs>\n</gml:Polygon>',
#     'format': 'SAFE',
#     'identifier': 'S2A_MSIL1C_20161207T105432_N0204_R051_T31UET_20161207T105428',
#     'instrumentshortname': 'MSI',
#     'sensoroperationalmode': 'INS-NOBS',
#     'instrumentname': 'Multi-Spectral Instrument',
#     'footprint': 'POLYGON ((2.999706370881351 52.3504731573947,4.611384362792962 52.3394848521498,4.576518664211577 51.35263389325745,2.999712727409819 51.36324170782969,2.999706370881351 52.3504731573947,2.999706370881351 52.3504731573947))',
#     's2datatakeid': 'GS2A_20161207T105432_007627_N02.04',
#     'platformidentifier': '2015-000A',
#     'orbitdirection': 'DESCENDING',
#     'platformserialidentifier': 'Sentinel-2A',
#     'processingbaseline': '02.04',
#     'processinglevel': 'Level-1C',
#     'producttype': 'S2MSI1C',
#     'platformname': 'Sentinel-2',
#     'size': '736.49 MB',
#     'uuid': 'ef5befd0-0418-4725-9c30-75d28dce673a',
#     'level1cpdiidentifier': 'S2A_OPER_MSI_L1C_TL_SGS__20161207T162012_A007627_T31UET_N02.04',
#     'granuleidentifier': 'S2A_OPER_MSI_L1C_TL_SGS__20161207T162012_A007627_T31UET_N02.04',
#     'datastripidentifier': 'S2A_OPER_MSI_L1C_DS_SGS__20161207T162012_S20161207T105428_N02.04'
#   }
# }
