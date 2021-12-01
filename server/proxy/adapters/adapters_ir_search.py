import json
from datetime import datetime

from django.contrib.gis.geos import GEOSGeometry, Point, Polygon

from .adapters_base import BaseProxyDataAdapter

DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


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

        for suggestion in raw_data.get("suggestions", []):

            # FIXME: IR SHOULD RETURN bbox AS A LIST OF LISTS
            # suggestion_bbox = Polygon(
            #     suggestion["bbox"]
            # ) if "bbox" in suggestion else None
            suggestion_center = Point(
                suggestion["center"]
            ) if "center" in suggestion else None

            #contact_details...
            for contact in suggestion.get("natureScotOffices", []):
                processed_data["contact_details"].append({
                    "area_name":
                        contact.get("area", {}).get("name", None),
                    "area_office_address":
                        # yapf: disable
                        filter(
                            None,
                            [
                                contact.get("office", {}).get(key)
                                for key in ["building", "number", "street", "district", "town"]
                            ]
                        ),
                    "postcode":
                        contact.get("office", {}).get("postcode", None),
                    "telephone_number":
                        contact.get("office", {}).get("telephone", None),
                    "email":
                        contact.get("office", {}).get("email", None),
                })

            # casework...
            for casework in suggestion.get("casework", []):
                processed_data["casework"].append({
                    "name":
                        f"Case {casework.get('code', 'NA')}",
                    "date":
                        datetime.strptime(
                            casework.get("received").strip("\""),
                            DATETIME_FORMAT
                        ) if "received" in casework else None,
                    "status":
                        casework.get("response", None),
                    "details": {},
                })

            # protected_areas...
            processed_data["protected_areas"].append({
                "name":
                    suggestion.get("title", None),
                "type":
                    suggestion.get("designation", {}).get("description", None),
                "area":
                    suggestion.get("area", None),
                "distance":
                    # TODO: THIS SHOULD PROBABLY USE suggestion_bbox INSTEAD OF suggestion_center
                    aoi.distance(suggestion_center)
                    if aoi and suggestion_center else None
            })

            # protected_features...
            for feature in raw_data.get("features", []):
                processed_data["protected_features"].append({
                    "name": feature.get("name", None),
                    "category": feature.get("category", None),
                    "subcategory": feature.get("subcategory", None),
                    "status": feature.get("conditionSummary", None),
                    "details": {
                        "pressures": feature.get("pressures", []),
                        "history": feature.get("history", []),
                    },
                })

        return processed_data
