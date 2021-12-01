import json
from datetime import datetime

from rest_framework.utils import encoders

from .adapters_base import BaseProxyDataAdapter

DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


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

        for suggestion in raw_data.get("suggestions", []):

            # extract contact_details...
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

            # extract casework...
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

            # extract protected_areas...
            processed_data["protected_areas"].append({
                "name":
                    suggestion.get("title", None),
                "type":
                    suggestion.get("designation", {}).get("description", None),
                "area":
                    suggestion.get("area", None)
            })

            # extract protected_features...
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

        # remove duplicates...
        keys = list(processed_data.keys())
        for key in keys:
            processed_data[key] = remove_duplicate_dicts_from_list(
                processed_data.pop(key)
            )

        return processed_data
