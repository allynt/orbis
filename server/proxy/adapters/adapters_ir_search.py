from datetime import datetime

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

        for suggestion in raw_data.get("suggestions", []):

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
                    suggestion.get("area", None)
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
