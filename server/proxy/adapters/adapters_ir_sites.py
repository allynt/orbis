"""
MVP to pull in summary info about sites from the IR API.
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Union

from flatten_json import flatten
import geopandas as gpd
import pandas as pd
from geopandas.geodataframe import GeoDataFrame
from pandas.core.frame import DataFrame

from .adapters_base import BaseProxyDataAdapter

# Format of `/sites` endpoint response:
# [
#   {
#     "sitecode": 1,
#     "title": "A' Mhoine",
#     "sitetype": "SSSI",
#     "eurocode": 135142,
#     "area": 5964.92,
#     ...
#   },
#  ...
# ]

SITES_GEOJSON_PATH = Path(
    os.path.dirname(os.path.abspath(__file__))
) / "SSSI_simplified.geojson"


def get_sites_gdf() -> GeoDataFrame:
    return gpd.read_file(SITES_GEOJSON_PATH.as_posix())


BasicJsonT = Union[int, float, bool, str]
JsonT = Union[Dict[str, 'JsonT'], List['JsonT'], int, float, bool, str]

SitesData = List[Dict[str, JsonT]]
FlatSitesData = List[Dict[str, BasicJsonT]]


def get_combined_geojson(ir_sites: SitesData) -> str:
    # Flatten any nested json objects
    flat_sites: FlatSitesData = [flatten(site, '.') for site in ir_sites]

    ir_df: DataFrame = pd.DataFrame(flat_sites)
    ir_df.set_index("sitecode", inplace=True)

    sites_gdf: GeoDataFrame = get_sites_gdf()[["PA_CODE", "geometry"]]
    sites_gdf.rename({"PA_CODE": "sitecode"}, axis=1, inplace=True)
    sites_gdf.set_index("sitecode", inplace=True)

    combined_gdf: GeoDataFrame = sites_gdf.join(ir_df, how="inner")
    return combined_gdf.to_json()


class IRSitesAdapter(BaseProxyDataAdapter):

    name = "ir-sites"

    def process_data(self, *args, **kwargs):
        if len(args) < 0:
            return {}

        raw_data: SitesData = args[0]

        return json.loads(get_combined_geojson(raw_data))
