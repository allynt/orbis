"""
Uses the api at: https://planningdata.london.gov.uk/api-guest/applications/_search
"""
from .adapters_base import BaseProxyDataAdapter

ICONS = [
    ("New Build", "new-build"),
    ("Conversion", "conversion"),
    ("Change of Use", "change-of-use"),
    ("Extension", "extension"),
]


class PldAdapter(BaseProxyDataAdapter):

    name = "pld"

    def process_data(self, raw_data):
        # assume raw_data is the same shape as SAMPLE_DATA
        processed_data = {"type": "FeatureCollection", "features": []}
        hits_data = raw_data['hits']['hits']

        for i, rd in enumerate(hits_data, start=1):
            source = rd["_source"]
            icon_id = None

            # Get the icon id for the Label name.
            for icon in ICONS:
                if icon[0] == source["development_type"]:
                    icon_id = icon[1]
                    break

            # yapf: disable
            processed_data["features"].append({
                "id": i,
                "geometry": {
                    "type":
                        "Point",
                    "coordinates": [
                        float(source["centroid"].get("lon")),
                        float(source["centroid"].get("lat")),
                    ]
                },
                "properties": {
                    "Project ID": rd["_id"],
                    "UPRN": source["uprn"],
                    "Address": f"{source['site_name']}, {source['street_name']}, {source['postcode']}",
                    "Description": source["description"],
                    "Status": source["status"],
                    "Development Type": source["development_type"],
                    "Total Number of Units": source["application_details"]["residential_details"]["total_no_proposed_residential_units"],
                    "icon": f"{icon_id}-{source['status'].lower()}",
                }
            })

        return processed_data

    @property
    def SAMPLE_DATA(self):
        return {
            "took": 8,
            "timed_out": False,
            "_shards": {
                "total": 1,
                "successful": 1,
                "skipped": 0,
                "failed": 0
            },
            "hits": {
                "total": {
                "value": 134,
                "relation": "eq"
                },
                "max_score": 6.532302,
                "hits": [
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-190520",
                    "_score": 6.532302,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "uprn": "100022963618",
                    "development_type": "New Build",
                    "last_updated": "2020-11-25T13: 43: 30.207Z",
                    "actual_completion_date": None,
                    "postcode": "E11 4JT",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 21,
                        "total_no_proposed_residential_units": 9,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 3
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 3
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 3
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 1
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 1
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 4
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 9
                        }
                    },
                    "description": "Demolition of existing building and construction of three storey building with formation of balconies on first and second floor rear and side elevations for 2x retail units and 9x residential units (2x1 bedroom, 3x2 bedroom, 3x3 bedroom, and 1x4 bedroom flats).",
                    "application_type_full": "Full planning permission",
                    "street_name": "High Road Leytonstone",
                    "decision_date": "20/01/2020",
                    "centroid": {
                        "lon": 0.005038,
                        "lat": 51.554645
                    },
                    "actual_commencement_date": None,
                    "site_name": "313-319",
                    "site_number": "313-319",
                    "lapsed_date": "20/01/2023",
                    "status": "Approved"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-200025",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "100022583943",
                    "development_type": "New Build",
                    "last_updated": "2020-11-25T13: 58: 32.550Z",
                    "actual_completion_date": None,
                    "postcode": "E17 5JB",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 2,
                        "total_no_proposed_residential_units": 1,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 1
                        }
                    },
                    "description": "Subdivision of site and construction of 1 x 2 bedroom, two-storey dwellinghouse with associated hard and soft landscaping, refuse and cycle storage.",
                    "application_type_full": "Full planning permission",
                    "street_name": "Shaw Square",
                    "decision_date": "28/02/2020",
                    "centroid": {
                        "lon": -0.03039,
                        "lat": 51.598733
                    },
                    "actual_commencement_date": None,
                    "site_name": "1",
                    "site_number": "1",
                    "lapsed_date": "28/02/2023",
                    "status": "Approved"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-192639",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "100023000452",
                    "development_type": "Change of Use",
                    "last_updated": "2020-11-25T12: 29: 57.694Z",
                    "actual_completion_date": None,
                    "postcode": "E4 8DD",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 6,
                        "total_no_proposed_residential_units": 5,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 1
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 1
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 1
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 1
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 5
                        }
                    },
                    "description": "Partial change of use from retail unit (Class A1) to  the rear to residential unit (Class C3) including construction of first floor rear extension and roof extension to create second floor, installation of access door and refuse been shutter doors at ground floor side elevation with associated landscaping, bicycle, refuse and recycle bin storage to provide 5 flats (1 studio, 1 x 2 bedroom, 3 x 1 bedroom flats).",
                    "application_type_full": "Full planning permission",
                    "street_name": "Old Church Road",
                    "decision_date": "22/11/2019",
                    "centroid": {
                        "lon": -0.017961,
                        "lat": 51.617885
                    },
                    "actual_commencement_date": None,
                    "site_name": "20-22",
                    "site_number": "20-22",
                    "lapsed_date": "22/11/2022",
                    "status": "Approved"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-190563",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "100022961254",
                    "development_type": "Conversion",
                    "last_updated": "2021-03-08T12: 05: 30.259Z",
                    "actual_completion_date": "06/06/2019",
                    "postcode": "E11 3NL",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 4,
                        "total_no_proposed_residential_units": 2,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 2
                        }
                    },
                    "description": "Lawful Development Certificate (Existing) - Continuous use of property as Ground Floor Self-contained flat 1 x 2 bedrooms & First floor self-contained flat 1 x 2 bedrooms.",
                    "application_type_full": "Lawful development: Existing use",
                    "street_name": "Cann Hall Road",
                    "decision_date": "06/06/2019",
                    "centroid": {
                        "lon": 0.014579,
                        "lat": 51.556415
                    },
                    "actual_commencement_date": "06/06/2019",
                    "site_name": "247",
                    "site_number": "247",
                    "lapsed_date": "06/06/2022",
                    "status": "Completed"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-181241",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "100022957188",
                    "development_type": "Change of Use",
                    "last_updated": "2020-11-25T12: 48: 56.430Z",
                    "actual_completion_date": None,
                    "postcode": "E10 7PN",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 0,
                        "total_no_proposed_residential_units": 0,
                        "total_no_proposed_residential_affordable_units": 0,
                        "total_no_proposed_residential_units_market_for_sale": 0
                        }
                    },
                    "description": "Change of use from retail unit (class A1) to day nursery (class D1).",
                    "application_type_full": "Full planning permission",
                    "street_name": "Lea Bridge Road",
                    "decision_date": "23/04/2019",
                    "centroid": {
                        "lon": -0.033004,
                        "lat": 51.567636
                    },
                    "actual_commencement_date": None,
                    "site_name": "189a",
                    "site_number": "189a",
                    "lapsed_date": "23/04/2022",
                    "status": "Approved"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-190713",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "200001428190",
                    "development_type": "New Build",
                    "last_updated": "2020-11-25T14: 04: 06.215Z",
                    "actual_completion_date": None,
                    "postcode": "E17 9RE",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 3,
                        "total_no_proposed_residential_units": 1,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Loss",
                            "no_bedrooms": 1
                            },
                            {
                            "change_type": "Loss",
                            "no_bedrooms": 1
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 3
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 1
                        }
                    },
                    "description": "Conversion of flats into single dwelling house. Construction of single storey rear extension and outbuilding.",
                    "application_type_full": "Full planning permission",
                    "street_name": "St Mary Road",
                    "decision_date": "18/03/2020",
                    "centroid": {
                        "lon": -0.017123,
                        "lat": 51.583735
                    },
                    "actual_commencement_date": None,
                    "site_name": "70",
                    "site_number": "70",
                    "lapsed_date": "18/03/2023",
                    "status": "Approved"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-193191",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "100022543510",
                    "development_type": "Conversion",
                    "last_updated": "2021-03-08T12: 05: 30.537Z",
                    "actual_completion_date": "15/11/2019",
                    "postcode": "E17 6JG",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 3,
                        "total_no_proposed_residential_units": 2,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Loss",
                            "no_bedrooms": 3
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 1
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 2
                        }
                    },
                    "description": "Lawful Development Certificate (Existing)-Use of property as two self-contained flats.",
                    "application_type_full": "Lawful development: Existing use",
                    "street_name": "Forest Road",
                    "decision_date": "15/11/2019",
                    "centroid": {
                        "lon": -0.031803,
                        "lat": 51.588424
                    },
                    "actual_commencement_date": "15/11/2019",
                    "site_name": "212",
                    "site_number": "212",
                    "lapsed_date": "15/11/2022",
                    "status": "Completed"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-200118",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "100023584756",
                    "development_type": "Change of Use",
                    "last_updated": "2020-11-25T13: 48: 21.892Z",
                    "actual_completion_date": None,
                    "postcode": "E10 7EQ",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 3,
                        "total_no_proposed_residential_units": 2,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 1
                            },
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 2
                        }
                    },
                    "description": "Lawful Development Certificate (Proposed) - Change of use from betting office (Sui Generis) to mixed use as betting office (Sui Generis) at ground floor and use as two self-contained residential units (1x1 bed & 1x2 bed) at first floor level. Unblocking of existing first floor rear windows.",
                    "application_type_full": "Lawful development: Proposed use",
                    "street_name": "Lea Bridge Road",
                    "decision_date": "11/03/2020",
                    "centroid": {
                        "lon": -0.013422,
                        "lat": 51.575264
                    },
                    "actual_commencement_date": None,
                    "site_name": "569-571",
                    "site_number": "569-571",
                    "lapsed_date": "01/01/2100",
                    "status": "Approved"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-192391",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "10009143615",
                    "development_type": "Conversion",
                    "last_updated": "2021-03-08T12: 05: 30.424Z",
                    "actual_completion_date": "16/09/2019",
                    "postcode": "E7 0EA",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 2,
                        "total_no_proposed_residential_units": 1,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 2
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 1
                        }
                    },
                    "description": "Lawful Development Certificate (Existing)-Use of basement as a two-bed self-contained flat.",
                    "application_type_full": "Lawful development: Existing use",
                    "street_name": "Dames Road",
                    "decision_date": "16/09/2019",
                    "centroid": {
                        "lon": 0.018145,
                        "lat": 51.557774
                    },
                    "actual_commencement_date": "16/09/2019",
                    "site_name": "243",
                    "site_number": "243",
                    "lapsed_date": "16/09/2022",
                    "status": "Completed"
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-191673",
                    "_score": 6.532302,
                    "_source": {
                    "uprn": "100022559864",
                    "development_type": "Conversion",
                    "last_updated": "2021-03-08T12: 05: 30.362Z",
                    "actual_completion_date": "21/08/2019",
                    "postcode": "E11 1HP",
                    "application_details": {
                        "residential_details": {
                        "total_no_proposed_bedrooms": 8,
                        "total_no_proposed_residential_units": 1,
                        "total_no_proposed_residential_affordable_units": 0,
                        "residential_units": [
                            {
                            "change_type": "Gain",
                            "no_bedrooms": 8
                            }
                        ],
                        "total_no_proposed_residential_units_market_for_sale": 1
                        }
                    },
                    "description": "Lawful Development Certificate (Existing)-Use of property as a House in Multiple Occupation (Sui generis) for 9 persons.",
                    "application_type_full": "Lawful development: Existing use",
                    "street_name": "Kirkdale Road",
                    "decision_date": "21/08/2019",
                    "centroid": {
                        "lon": 0.011671,
                        "lat": 51.569621
                    },
                    "actual_commencement_date": "21/08/2019",
                    "site_name": "17",
                    "site_number": "17",
                    "lapsed_date": "21/08/2022",
                    "status": "Completed"
                    }
                }
                ]
            }
        }
