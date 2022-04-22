import json

from proxy.adapters.adapters_base import BaseProxyDataAdapter

SITE_LINK_URL = "https://sitelink.nature.scot/site/"
CATEGORIES_ORDER = {
    "SSSI": 0,
    "SAC": 1,
    "SPA": 2,
    "RAMSAR": 3,
    "GCR": 4,
    "LNR": 5,
    "CNTRYPK": 6
}


class IRImpactAssessmentAdapter(BaseProxyDataAdapter):

    name = "ir-impact-assessment"

    def process_data(self, raw_data):
        """
        Processes the raw data from the API and returns an ordered
        list of dicts.
        """
        processed_data = {
            "summary": raw_data["summary"],
            "activities": raw_data["impacts"],
            "areas": [],
        }

        # Get mock impacts-by-features data to merge with live API data,
        # if it exists.
        if self.proxy.proxy_extra_content is not None:
            processed_data["impacts_by_feature"] = json.load(
                self.proxy.proxy_extra_content
            )

        # iterate over the areas in the raw data to extract the relevant data.
        for area in raw_data["areas"]:
            properties = area["properties"]

            area_data = {
                "strapline":
                    "(This protected area is within your Area of Interest)",
                "areas": [],
            }

            sitecode = properties["sitecode"]
            category = properties['category'].upper()
            area_data["title"] = f"{category} {sitecode} {properties['title']}"
            area_data["link"] = f"{SITE_LINK_URL}{sitecode}"
            area_data["category"] = category

            # Only process features if there are any.
            if len(properties["features"]) > 0:
                features = {
                    "name":
                        "Notified Natural Features",
                    "heading":
                        f"{category} {sitecode}: {properties['title']} Feature Citations",
                    "columnHeadings": [
                        "These features are protected by this designation"
                    ],
                    "columns": [],
                }

                for feature in properties["features"]:
                    features["columns"].append({
                        "label": feature["name"],
                    })

                area_data["areas"].append(features)

            # Only process operations if there are any.
            if len(properties["operationsRequiringConsent"]) > 0:
                operations = {
                    "name":
                        "Operations Requiring Consent",
                    "heading":
                        "Carrying out any of these activities on this SSSI requires the consent of Nature Scot",
                    "columnHeadings": [
                        "Standard Ref. No.", "Type of Operation"
                    ],
                    "columns": [],
                }

                # For each operation, extract the `code` and `description`` and add it to the operations dict.
                for operation in properties["operationsRequiringConsent"]:
                    operations["columns"].append({
                        "id": operation["code"],
                        "label": operation["description"],
                    })

                area_data["areas"].append(operations)

            processed_data["areas"].append(area_data)

        processed_data["areas"].sort(
            key=lambda val: CATEGORIES_ORDER[val["category"]]
        )

        return processed_data

    @property
    def SAMPLE_DATA(self):
        return {
            "summary": [{
                "code": "biodiversityImpacts",
                "category": "Biodiversity",
                "score": -1,
                "impact": -0.12
            },
                        {
                            "code": "chemicalImpacts",
                            "category": "Chemical",
                            "score": 0,
                            "impact": 0
                        },
                        {
                            "code": "peopleImpacts",
                            "category": "People",
                            "score": 0,
                            "impact": 0
                        },
                        {
                            "code": "soilWaterAirImpacts",
                            "category": "Soil, Water, Air",
                            "score": -1,
                            "impact": -0.15
                        },
                        {
                            "code": "environmentalImpacts",
                            "category": "Environmental",
                            "score": -5,
                            "impact": -0.28
                        }],
            "areas": [{
                "type": "Feature",
                "properties": {
                    "sitecode":
                        8367,
                    "area":
                        1311,
                    "category":
                        "sac",
                    "description":
                        "",
                    "designation": {
                        "code":
                            "SAC",
                        "started":
                            "2005-03-17T00:00:00.000Z",
                        "link":
                            "https://www.nature.scot/professional-advice/safeguarding-protected-areas-and-species/protected-areas/international-designations/natura-sites/special-areas-conservation-sacs",
                        "isCoastal":
                            False,
                        "isUpland":
                            False,
                        "hasUnderpinningNatura":
                            False,
                        "ownerOccupers":
                            0,
                        "notificationCode":
                            0,
                        "description":
                            "",
                        "scm":
                            False,
                        "_id":
                            "619a38b649ba281f12a29eb6"
                    },
                    "dffcSite":
                        False,
                    "euroCode":
                        "UK0030263",
                    "features": [
                        {
                            "id":
                                13947,
                            "category":
                                "Fish",
                            "subcategory":
                                "Fish",
                            "conditionLatest":
                                "Favourable Maintained",
                            "conditionSummary":
                                "Favourable",
                            "lastVisit":
                                "2011-11-09T00:00:00.000Z",
                            "name":
                                "River lamprey (Lampetra fluviatilis)",
                            "isWaterFeature":
                                True,
                            "isActionPlanFeature":
                                False,
                            "scmAssessment":
                                "2",
                            "pressures": [{
                                "name": "Forestry operations",
                                "recordedAs": "Forestry operations",
                                "keywords": []
                            },
                                          {
                                              "name": "Water management",
                                              "recordedAs": "Water management",
                                              "keywords": []
                                          },
                                          {
                                              "name":
                                                  "Water quality",
                                              "recordedAs":
                                                  "Pollution - sewage",
                                              "keywords": []
                                          }]
                        },
                        {
                            "id":
                                13948,
                            "category":
                                "Fish",
                            "subcategory":
                                "Fish",
                            "conditionLatest":
                                "Favourable Maintained",
                            "conditionSummary":
                                "Favourable",
                            "lastVisit":
                                "2011-11-09T00:00:00.000Z",
                            "name":
                                "Brook lamprey (Lampetra planeri)",
                            "isWaterFeature":
                                True,
                            "isActionPlanFeature":
                                False,
                            "scmAssessment":
                                "2",
                            "pressures": [
                                {
                                    "name": "Forestry operations",
                                    "recordedAs": "Forestry operations",
                                    "keywords": []
                                },
                                {
                                    "name":
                                        "Water management",
                                    "recordedAs":
                                        "Water Dependant Pressure- point source pollution",
                                    "keywords": []
                                },
                                {
                                    "name": "Water quality",
                                    "recordedAs": "Pollution - sewage",
                                    "keywords": []
                                }
                            ]
                        },
                        {
                            "id":
                                13949,
                            "category":
                                "Fish",
                            "subcategory":
                                "Fish",
                            "conditionLatest":
                                "Unfavourable Declining",
                            "conditionSummary":
                                "Unfavourable",
                            "lastVisit":
                                "2011-11-09T00:00:00.000Z",
                            "name":
                                "Sea lamprey (Petromyzon marinus)",
                            "isWaterFeature":
                                True,
                            "isActionPlanFeature":
                                False,
                            "scmAssessment":
                                "2",
                            "pressures": [
                                {
                                    "name": "Forestry operations",
                                    "recordedAs": "Forestry operations",
                                    "keywords": []
                                },
                                {
                                    "name":
                                        "Water management",
                                    "recordedAs":
                                        "Water Dependant Pressure- morphological alteration",
                                    "keywords": []
                                },
                                {
                                    "name": "Water quality",
                                    "recordedAs": "Pollution - sewage",
                                    "keywords": []
                                }
                            ]
                        },
                        {
                            "id":
                                13950,
                            "category":
                                "Fish",
                            "subcategory":
                                "Fish",
                            "conditionLatest":
                                "Unfavourable Recovering",
                            "conditionSummary":
                                "Favourable",
                            "lastVisit":
                                "2011-08-19T00:00:00.000Z",
                            "name":
                                "Atlantic salmon (Salmo salar)",
                            "isWaterFeature":
                                True,
                            "isActionPlanFeature":
                                False,
                            "scmAssessment":
                                "2",
                            "pressures": [
                                {
                                    "name": "Forestry operations",
                                    "recordedAs": "Forestry operations",
                                    "keywords": []
                                },
                                {
                                    "name":
                                        "Invasive species",
                                    "recordedAs":
                                        "Presence or changing extent of invasive species",
                                    "keywords": []
                                },
                                {
                                    "name": "Water quality",
                                    "recordedAs": "Water quality",
                                    "keywords": []
                                }
                            ]
                        }
                    ],
                    "geologicalReviewBlock":
                        "",
                    "geologicalReviewNumber":
                        0,
                    "link":
                        "https://apps.snh.gov.uk/sitelink-api/v1/sites/8367",
                    "localAuthority":
                        "Stirling",
                    "location":
                        "MIXED",
                    "mpaNet":
                        False,
                    "natureScotArea":
                        "Forth",
                    "operationsRequiringConsent": [],
                    "siteType":
                        "",
                    "status":
                        "Current",
                    "title":
                        "River Teith"
                }
            }],
            "impacts": [{
                "title":
                    "Start grazing cattle",
                "activityCode":
                    "grazingCattleStart",
                "description":
                    "Minor or no positive impact",
                "totalImpact":
                    None,
                "impacts": [{
                    "activity":
                        "livestock_largeAnimals",
                    "title":
                        "Large animals",
                    "description":
                        "Minor or no positive impact",
                    "impacts": [
                        {
                            "code": "biodiversityImpacts",
                            "category": "Biodiversity",
                            "description": "Slightly negative",
                            "score": -1,
                            "impact": -0.06
                        },
                        {
                            "code": "chemicalImpacts",
                            "category": "Chemical",
                            "description": "No impact",
                            "score": 0,
                            "impact": 0
                        },
                        {
                            "code": "peopleImpacts",
                            "category":
                                "People",
                            "description": "Minor or no positive impact",
                            "score": 0,
                            "impact": 0.006
                        },
                        {
                            "code": "soilWaterAirImpacts",
                            "category":
                                "Soil, Water, Air",
                            "description": "Minor or no negative impact",
                            "score": 0,
                            "impact": -0.045
                        },
                        {
                            "code": "environmentalImpacts",
                            "category": "Environmental",
                            "description": "Negative",
                            "score": -2,
                            "impact": -0.1
                        }
                    ]
                }],
                "possibleMitigations": [
                    "Consider ...", "Alternatively, consider ..."
                ]
            },
                        {
                            "title":
                                "Start grazing sheep",
                            "activityCode":
                                "grazingSheepStart",
                            "description":
                                "Minor or no positive impact",
                            "totalImpact":
                                None,
                            "impacts": [{
                                "activity":
                                    "agriculture_grazingLand",
                                "title":
                                    "Grazing land",
                                "description":
                                    "Minor or no positive impact",
                                "impacts": [
                                    {
                                        "code":
                                            "biodiversityImpacts",
                                        "category":
                                            "Biodiversity",
                                        "description":
                                            "Minor or no negative impact",
                                        "score":
                                            0,
                                        "impact":
                                            -0.02
                                    },
                                    {
                                        "code": "chemicalImpacts",
                                        "category": "Chemical",
                                        "description": "No impact",
                                        "score": 0,
                                        "impact": 0
                                    },
                                    {
                                        "code":
                                            "peopleImpacts",
                                        "category":
                                            "People",
                                        "description":
                                            "Minor or no negative impact",
                                        "score":
                                            0,
                                        "impact":
                                            -0.006
                                    },
                                    {
                                        "code": "soilWaterAirImpacts",
                                        "category": "Soil, Water, Air",
                                        "description": "Slightly negative",
                                        "score": -1,
                                        "impact": -0.065
                                    },
                                    {
                                        "code": "environmentalImpacts",
                                        "category": "Environmental",
                                        "description": "Negative",
                                        "score": -2,
                                        "impact": -0.13
                                    }
                                ]
                            },
                                        {
                                            "activity":
                                                "livestock_smallAnimals",
                                            "title":
                                                "Small animals",
                                            "description":
                                                "Minor or no positive impact",
                                            "impacts": [
                                                {
                                                    "code":
                                                        "biodiversityImpacts",
                                                    "category":
                                                        "Biodiversity",
                                                    "description":
                                                        "Minor or no negative impact",
                                                    "score":
                                                        0,
                                                    "impact":
                                                        -0.04
                                                },
                                                {
                                                    "code": "chemicalImpacts",
                                                    "category":
                                                        "Chemical",
                                                    "description": "No impact",
                                                    "score": 0,
                                                    "impact": 0
                                                },
                                                {
                                                    "code": "peopleImpacts",
                                                    "category":
                                                        "People",
                                                    "description": "No impact",
                                                    "score": 0,
                                                    "impact": 0
                                                },
                                                {
                                                    "code":
                                                        "soilWaterAirImpacts",
                                                    "category":
                                                        "Soil, Water, Air",
                                                    "description":
                                                        "Minor or no negative impact",
                                                    "score":
                                                        0,
                                                    "impact":
                                                        -0.04
                                                },
                                                {
                                                    "code":
                                                        "environmentalImpacts",
                                                    "category":
                                                        "Environmental",
                                                    "description":
                                                        "Slightly negative",
                                                    "score":
                                                        -1,
                                                    "impact":
                                                        -0.05
                                                }
                                            ]
                                        }],
                            "possibleMitigations": [
                                "Consider ...", "Alternatively, consider ..."
                            ]
                        }]
        }
