import json
import random
from datetime import datetime

from django.contrib.gis.geos import GEOSGeometry, Point, Polygon
from rest_framework.utils import encoders

from .adapters_base import BaseProxyDataAdapter

DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"

PROTECTED_FEATURE_TYPES = [
    "warning",
    "not-good",
    "neutral",
    "good",
    "very-good",
]


def remove_duplicate_dicts_from_list(list_of_dicts):
    # a bit convoluted b/c the dicts can be arbitrarily complex
    # TODO: MAY WANT TO REPLACE W/ A LIBRARY TO COMPARE DICTS AS PER:
    #  https://miguendes.me/the-best-way-to-compare-two-dictionaries-in-python#heading-using-the-right-tool-for-the-job
    #  https://github.com/seperman/deepdiff#deep-hash
    return [
        json.loads(x)
        for x in set(
            [
                json.dumps(x, cls=encoders.JSONEncoder, sort_keys=True)
                for x in list_of_dicts
            ]
        )
    ]  # yapf: disable


class IRSearchAdapter(BaseProxyDataAdapter):

    name = "ir-search"

    def process_data(self, raw_data):

        processed_data = {
            "contact_details": [],
            "casework": [],
            "protected_areas": [],
            "protected_features": [],
        }

        aoi = GEOSGeometry(
            json.dumps(raw_data["geometry"])
        ) if "geometry" in raw_data else None

        bng_aoi = bng_aoi = aoi.transform(27700, clone=True) if aoi else None

        aoi_buffered = GEOSGeometry(
            json.dumps(raw_data["buffered"])
        ) if "buffered" in raw_data else None

        # extract contact_details...
        office = raw_data["organisation"]["office"]
        processed_data["contact_details"].append({
            "area_office": office.get("building", None),
            "area_name":
                raw_data.get("organisation").get("region", None),
            "area_office_address":
                # yapf: disable
                filter(
                    None,
                    [
                        office.get(key)
                        for key in ["building", "number", "street", "district", "town"]
                    ]
                ),
            "postcode":
                office.get("postcode", None),
            "telephone_number":
                office.get("telephone", None),
            "email":
                office.get("email", None),
        })

        for suggestion in raw_data.get("suggestions", []):

            suggestion_bbox = Polygon.from_bbox(
                suggestion["bbox"]
            ) if "bbox" in suggestion else None

            bng_suggestion_bbox = None
            if suggestion_bbox:
                bng_suggestion_bbox = suggestion_bbox.clone()
                bng_suggestion_bbox.srid = 4326
                bng_suggestion_bbox.transform(27700)

            suggestion_center = Point(
                suggestion["center"]
            ) if "center" in suggestion else None

            # extract casework...
            for casework in suggestion.get("casework", []):
                processed_data["casework"].append({
                    "name":
                        f"Case {casework.get('code', 'NA')}",
                    "site_name":
                        suggestion.get("title", None),
                    "date":
                        datetime.strptime(
                            casework.get("received").strip("\""),
                            DATETIME_FORMAT
                        ) if "received" in casework else None,
                    "status":
                        casework.get("response", None),
                    "details": {},
                })

            # extract protected_areas...
            processed_data["protected_areas"].append({
                "name":
                    suggestion.get("title", None),
                "type":
                    suggestion.get("designation", {}).get("description", None),
                "area":
                    suggestion.get("area", None),
                "in_aoi":
                    aoi.intersects(suggestion_bbox)
                    if aoi and suggestion_bbox else None,
                "in_aoi_buffered":
                    aoi_buffered.intersects(suggestion_bbox)
                    if aoi_buffered and suggestion_bbox else None,
                "distance":
                    round(bng_aoi.distance(bng_suggestion_bbox) /
                          1000, 2) if bng_aoi and bng_suggestion_bbox else None
            })

            # extract protected_features...
            for feature in suggestion.get("features", []):
                processed_data["protected_features"].append({
                    "name": feature.get("name", None),
                    "category": feature.get("category", None),
                    "subcategory": feature.get("subcategory", None),
                    "status": feature.get("conditionSummary", None),
                    "details": {
                        "pressures": feature.get("pressures", []),
                        "history": feature.get("history", []),
                    },  # FIXME: IMPROVE THESE NEXT 3 FIELDS
                    "title": feature.get("subcategory", None),
                    "description": feature.get("name", None),
                    "type": random.choice(PROTECTED_FEATURE_TYPES),
                })

        # remove duplicates...
        keys = list(processed_data.keys())
        for key in keys:
            processed_data[key] = remove_duplicate_dicts_from_list(
                processed_data.pop(key)
            )

        return processed_data
