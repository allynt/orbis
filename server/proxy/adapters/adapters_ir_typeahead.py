from .adapters_base import BaseProxyDataAdapter

from django.core.exceptions import BadRequest

TYPES = {
    "protected_area": "protected-area",
    "place": "place",
}

class IRTypeaheadSearchAdapter(BaseProxyDataAdapter):

    name = "ir-typeahead-search"

    def process_data(self, raw_data):
        processed_data = []

        for suggestion in raw_data.get("suggestions", []):
            name = None
            if suggestion["type"] == TYPES["protected_area"]:
                name = f'{suggestion["title"]} - {suggestion["code"]}'
            elif suggestion["type"] == TYPES["place"]:
                name = f'{suggestion["title"]} - {suggestion["localAuthority"]}'
            else:
                # Throw error, unknown strategy.
                raise BadRequest(f'Unknown suggestion type: {suggestion["type"]}, valid values are: {TYPES}')

            processed_data.append({ "name": name })

        return processed_data

    @property
    def SAMPLE_DATA(self):
        return {
            "type": "gazetteer",
            "suggestions": [
                {
                "type": "protected-area",
                "sitecode": 10245,
                "title": "Northern Islay [Coastal Geomorphology of Scotland]",
                "localAuthority": "",
                "code": "GCR",
                "area": 450,
                "bbox": [
                    -6.2213734,
                    55.9106797,
                    -6.1190647,
                    55.9388032
                ],
                "center": [
                    -6.171673,
                    55.926253
                ]
                },
                {
                "type": "place",
                "title": "Scotlandwell",
                "historicCounty": "Kinross-shire",
                "localAuthority": "Perth and Kinross",
                "alternativeTitles": "",
                "center": [
                    -3.3147653,
                    56.199626
                ]
                }
            ]
            }
