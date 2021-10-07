import pandas as pd

from .adapters_base import BaseProxyDataAdapter
"""
Uses the api at: https://planningdata.london.gov.uk/api-guest/applications/_search
"""


class PldAdapter(BaseProxyDataAdapter):

    name = "pld"

    def process_data(self, raw_data):
        # assume raw_data is the same shape as SAMPLE_DATA
        processed_data = {"type": "FeatureCollection", "features": []}

        for i, rd in enumerate(raw_data['hits']['hits'], start=1):
            source = rd["_source"]
            commencement_date = source.get("actual_commencement_date")
            completion_date = source.get("actual_completion_date")

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
                    "Address": f"{source['site_number']}, {source['street_name']}, {source['postcode']}",
                    "Description": source["description"],
                    "Application Approved Date": source.get("decision_date"),
                    "Permission Expires": source.get("lapsed_date"),
                    "Type of Approval": source["application_type_full"],
                    "Commencement Date": commencement_date
                        if commencement_date is not None else "null",
                    "Completion Date": completion_date
                        if completion_date is not None else "null",
                    "Total Number of Units": "TBD",
                    "Total Number of Bedrooms": "TBD",
                    "Overall Gain / Loss of Units": "TBD",
                    "Housing Mix": "TBD",
                    "Tenure Mix": "TBD",
                }
            })

        return processed_data

    @property
    def SAMPLE_DATA(self):
        return {
            "took": 7,
            "timed_out": False,
            "_shards": {
                "total": 1, "successful": 1, "skipped": 0, "failed": 0
            },
            "hits": {
                "total": {
                    "value": 134, "relation": "eq"
                },
                "max_score":
                    6.194662,
                "hits": [{
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-183905",
                    "_score": 6.194662,
                    "_ignored": ["polygon"],
                    "_source": {
                        "uprn":
                            "100023001025",
                        "development_type":
                            "New Build",
                        "last_updated":
                            "2020-11-25T14:50:24.091Z",
                        "actual_completion_date":
                            None,
                        "postcode":
                            "E4 9AA",
                        "application_details": {
                            "residential_details": {
                                "total_no_proposed_bedrooms":
                                    5,
                                "total_no_proposed_residential_units":
                                    4,
                                "total_no_proposed_residential_affordable_units":
                                    0,
                                "total_no_proposed_residential_units_market_for_sale":
                                    4
                            }
                        },
                        "description":
                            "Construction of 2 buildings (1 and 2 storey) comprising 4 dwellings (3x1 bedroom, 1x2 bedroom) together with refuse and cycle storage, following demolition of existing workshops and storage.",
                        "application_type_full":
                            "Full planning permission",
                        "street_name":
                            "Chingford Mount Road",
                        "decision_date":
                            "05/04/2019",
                        "polygon": {
                            "geometries": [{
                                "coordinates": [[[
                                    537376.855262, 192187.23603
                                ], [537380.757874, 192156.2797181], [
                                    537381.6177716, 192148.8713699
                                ], [537379.5672466, 192148.606786], [
                                    537380.0964144, 192142.918233
                                ], [537367.8594107, 192141.5953137], [
                                    537367.1979511, 192147.6145966
                                ], [537369.314622, 192147.8791804], [
                                    537368.0578486, 192158.5286809
                                ], [537371.100563, 192158.9917027], [
                                    537369.248476, 192174.0068368
                                ], [537375.2677589, 192174.4698586], [
                                    537373.6141097, 192186.8391542
                                ], [537376.855262, 192187.23603]]],
                                "type": "Polygon"
                            }],
                            "type": "geometrycollection"
                        },
                        "centroid": {
                            "lon": -0.017416, "lat": 51.611491
                        },
                        "actual_commencement_date":
                            None,
                        "site_number":
                            "104",
                        "lapsed_date":
                            "05/04/2022",
                        "status":
                            "Approved"
                    }
                },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-183443",
                             "_score": 6.194662,
                             "_source": {
                                 "uprn":
                                     "100022986526",
                                 "development_type":
                                     "New Build",
                                 "last_updated":
                                     "2020-11-25T13:35:27.681Z",
                                 "actual_completion_date":
                                     None,
                                 "postcode":
                                     "E17 9DZ",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             17,
                                         "total_no_proposed_residential_units":
                                             9,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             9
                                     }
                                 },
                                 "description":
                                     "Demolition of existing building and construction of a part three, part four storey residential building with basement to provide 9 self-contained flats (2 x 3 bedroom, 3 x 2 bedroom and 4 x 1 bedroom) with associated cycle and refuse storage, landscaping and green roofs.",
                                 "application_type_full":
                                     "Full planning permission",
                                 "street_name":
                                     "Lea Bridge Road,",
                                 "decision_date":
                                     "29/03/2019",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates": [[
                                             [538198.594086, 188504.6529083],
                                             [538190.921154, 188490.6299636], [
                                                 538188.8044831, 188493.0112184
                                             ], [538185.100309, 188498.0383117],
                                             [538169.754445, 188521.3216916], [
                                                 538180.3377995, 188527.4071205
                                             ], [538183.248222, 188528.4654559],
                                             [538198.594086, 188504.6529083]
                                         ]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": -0.007161, "lat": 51.578521
                                 },
                                 "actual_commencement_date":
                                     None,
                                 "site_number":
                                     "727",
                                 "lapsed_date":
                                     "29/03/2022",
                                 "status":
                                     "Approved"
                             }
                         },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-192458",
                             "_score": 6.194662,
                             "_source": {
                                 "uprn":
                                     "100022984172",
                                 "development_type":
                                     "New Build",
                                 "last_updated":
                                     "2020-11-25T12:54:30.239Z",
                                 "actual_completion_date":
                                     None,
                                 "postcode":
                                     "E17 8DN",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             0,
                                         "total_no_proposed_residential_units":
                                             0,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             0
                                     }
                                 },
                                 "description":
                                     "Two-storey building comprising 10 classrooms, offices and ancillary spaces; in addition to a single-storey extension to the existing dining hall comprising an activity room, additional dining and ancillary spaces; along with re-landscaping and changes to existing cycle storage in association with increasing the schools admission numbers from 900 to 1200 pupils.",
                                 "application_type_full":
                                     "Full planning permission",
                                 "street_name":
                                     "Markhouse Road",
                                 "decision_date":
                                     "22/11/2019",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates": [[
                                             [536631.7925239, 188131.4166455],
                                             [536690.5301414, 188162.6375413], [
                                                 536694.2343155, 188156.2875286
                                             ], [536693.17598, 188155.7583609],
                                             [536699.5259927, 188144.3812548], [
                                                 536765.9365422, 188179.0417408
                                             ], [
                                                 536747.9448396, 188213.9668106
                                             ], [
                                                 536779.4303192, 188231.6939294
                                             ], [
                                                 536842.6658623, 188112.8957751
                                             ], [
                                                 536850.8679621, 188093.3165693
                                             ], [
                                                 536823.0866565, 188073.7373635
                                             ], [
                                                 536821.4991533, 188079.8227923
                                             ], [
                                                 536815.1491406, 188090.9353145
                                             ], [536812.503302, 188092.5228177],
                                             [536728.3656337, 188047.8081449], [
                                                 536720.4281179, 188063.154009
                                             ], [
                                                 536670.9509356, 188036.4310389
                                             ], [
                                                 536666.7175938, 188044.8977225
                                             ], [
                                                 536634.4383625, 188120.3041233
                                             ], [
                                                 536631.7925239, 188131.4166455
                                             ]
                                         ]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": -0.028375, "lat": 51.57557
                                 },
                                 "actual_commencement_date":
                                     None,
                                 "site_number":
                                     "Kelmscott School, 245",
                                 "lapsed_date":
                                     "22/11/2022",
                                 "status":
                                     "Approved"
                             }
                         },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-191345",
                             "_score": 6.194662,
                             "_source": {
                                 "uprn":
                                     "100022593556",
                                 "development_type":
                                     "Extension",
                                 "last_updated":
                                     "2020-11-25T13:36:26.340Z",
                                 "actual_completion_date":
                                     None,
                                 "postcode":
                                     "E10 5DZ",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             12,
                                         "total_no_proposed_residential_units":
                                             4,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             4
                                     }
                                 },
                                 "description":
                                     "Partial demolition of ground floor extension at 104 Vicarage Road and construction of part first floor rear extension and roof extension to create second floor with associated cycle and bin storage, including front and rear landscaping and boundary work, replacement of door and window at ground floor front elevation with double door in connection with change of 3 x 2 bedroom flats to 1 x 3 bedroom, 1 x 2 bedroom, and 1 x 1 bedroom flats. Construction of roof extension to 106 Vicarage road to create second floor to convert existing 4 bedroom house to 6 bedrooms.(Joint application).",
                                 "application_type_full":
                                     "Full planning permission",
                                 "street_name":
                                     "Vicarage Road",
                                 "decision_date":
                                     "07/08/2019",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates": [[
                                             [537702.6380281, 187256.8166963], [
                                                 537712.0307552, 187245.3072983
                                             ], [537667.9775421, 187209.323893],
                                             [537658.7171069, 187220.833291], [
                                                 537702.6380281, 187256.8166963
                                             ]
                                         ]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": -0.014667, "lat": 51.567246
                                 },
                                 "actual_commencement_date":
                                     None,
                                 "site_number":
                                     "104 and 106",
                                 "lapsed_date":
                                     "07/08/2022",
                                 "status":
                                     "Approved"
                             }
                         },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-191974",
                             "_score": 6.194662,
                             "_source": {
                                 "uprn":
                                     "100022541643",
                                 "development_type":
                                     "Conversion",
                                 "last_updated":
                                     "2021-03-08T12:05:30.353Z",
                                 "actual_completion_date":
                                     "12/08/2019",
                                 "postcode":
                                     "E17 6HX",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             3,
                                         "total_no_proposed_residential_units":
                                             2,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             2
                                     }
                                 },
                                 "description":
                                     "Lawful Development Certificate (Existing)-Use of property as two self-contained flats.",
                                 "application_type_full":
                                     "Lawful development: Existing use",
                                 "street_name":
                                     "Farnborough Avenue",
                                 "decision_date":
                                     "12/08/2019",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates": [[
                                             [536161.0546736, 189544.1322919],
                                             [536188.0422276, 189550.8791804], [
                                                 536189.4974388, 189546.2489628
                                             ], [
                                                 536161.9807171, 189539.8989501
                                             ], [536161.5838413, 189542.147913],
                                             [536161.0546736, 189544.1322919]
                                         ]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": -0.03585, "lat": 51.588303
                                 },
                                 "actual_commencement_date":
                                     "12/08/2019",
                                 "site_number":
                                     "13",
                                 "lapsed_date":
                                     "12/08/2022",
                                 "status":
                                     "Completed"
                             }
                         },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-192012",
                             "_score": 6.194662,
                             "_source": {
                                 "uprn":
                                     "100022564292",
                                 "development_type":
                                     "New Build",
                                 "last_updated":
                                     "2020-11-25T11:21:40.640Z",
                                 "actual_completion_date":
                                     None,
                                 "postcode":
                                     "E17 4DT",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             2,
                                         "total_no_proposed_residential_units":
                                             1,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             1
                                     }
                                 },
                                 "description":
                                     "Construction of a two storey building with associated car parking, cycle storage, refuse and recycle storage, and soft landscaping to provide a 2 bedroom dwellinghouse (amended description)",
                                 "application_type_full":
                                     "Full planning permission",
                                 "street_name":
                                     "Longacre Road",
                                 "decision_date":
                                     "23/09/2019",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates": [[
                                             [538687.8718567, 190804.327068],
                                             [538687.6072729, 190805.9145712], [
                                                 538686.9458132, 190807.3697824
                                             ], [
                                                 538698.5875032, 190825.3614851
                                             ], [
                                                 538716.7114978, 190816.3656337
                                             ], [
                                                 538691.9729066, 190811.4708323
                                             ], [538687.8718567, 190804.327068]
                                         ]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": 0.001134, "lat": 51.599126
                                 },
                                 "actual_commencement_date":
                                     None,
                                 "site_number":
                                     "37",
                                 "lapsed_date":
                                     "23/09/2022",
                                 "status":
                                     "Approved"
                             }
                         },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-183705",
                             "_score": 6.194662,
                             "_source": {
                                 "uprn":
                                     "100022599352",
                                 "development_type":
                                     "Change of Use",
                                 "last_updated":
                                     "2020-11-25T13:28:48.357Z",
                                 "actual_completion_date":
                                     None,
                                 "postcode":
                                     "E17 3LX",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             0,
                                         "total_no_proposed_residential_units":
                                             0,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             0
                                     }
                                 },
                                 "description":
                                     "Change of use from retail (Use Class A1) to a mixed use Sui Generis (A1/A3); new shop front; removal of existing single storey flat roof to the rear; associated hard and soft landscaping; cycle provision and boundary treatment.",
                                 "application_type_full":
                                     "Full planning permission",
                                 "street_name":
                                     "Wood Street",
                                 "decision_date":
                                     "09/04/2019",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates":
                                             [[[538427.8088858, 189517.5328296],
                                               [538429.7932648, 189511.9765685],
                                               [538408.6927017,
                                                189504.5682203], [
                                                    538407.9650961,
                                                    189504.3697824
                                                ], [
                                                    538407.6343663,
                                                    189504.6343663
                                                ], [
                                                    538407.3697824,
                                                    189504.8989501
                                                ], [
                                                    538405.5838413,
                                                    189509.9921895
                                                ], [
                                                    538427.8088858,
                                                    189517.5328296
                                                ]]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": -0.003493, "lat": 51.587443
                                 },
                                 "actual_commencement_date":
                                     None,
                                 "site_number":
                                     "145",
                                 "lapsed_date":
                                     "09/04/2022",
                                 "status":
                                     "Approved"
                             }
                         },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-191541",
                             "_score": 6.194662,
                             "_ignored": ["polygon"],
                             "_source": {
                                 "uprn":
                                     "10091183210",
                                 "development_type":
                                     "Conversion",
                                 "last_updated":
                                     "2021-03-08T12:05:30.344Z",
                                 "actual_completion_date":
                                     "15/07/2019",
                                 "postcode":
                                     "E17 7DB",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             6,
                                         "total_no_proposed_residential_units":
                                             6,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             6
                                     }
                                 },
                                 "description":
                                     "Lawful Development Certificate (Existing) - Use of upper floor as four self-contained flats and rear stable building as two self-contained residential units.",
                                 "application_type_full":
                                     "Lawful development: Existing use",
                                 "street_name":
                                     "High Street",
                                 "decision_date":
                                     "15/07/2019",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates": [[
                                             [536518.3890653, 188876.1093472],
                                             [536516.5369782, 188876.9030988], [
                                                 536503.3077851, 188910.6375413
                                             ], [
                                                 536517.9921895, 188917.5167217
                                             ], [
                                                 536521.4317797, 188910.3729574
                                             ], [
                                                 536518.2567733, 188908.7854542
                                             ], [536520.77032, 188904.6844044],
                                             [536519.9765685, 188903.3614851], [
                                                 536516.4046863, 188901.7739819
                                             ], [
                                                 536525.1359538, 188878.7551858
                                             ], [
                                                 536518.3890653, 188876.1093472
                                             ]
                                         ]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": -0.03107, "lat": 51.582342
                                 },
                                 "actual_commencement_date":
                                     "15/07/2019",
                                 "site_number":
                                     "67",
                                 "lapsed_date":
                                     "15/07/2022",
                                 "status":
                                     "Completed"
                             }
                         },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-184308",
                             "_score": 6.194662,
                             "_source": {
                                 "uprn":
                                     "200001422540",
                                 "development_type":
                                     "Extension",
                                 "last_updated":
                                     "2020-11-25T11:22:48.569Z",
                                 "actual_completion_date":
                                     None,
                                 "postcode":
                                     "E11 1JL",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             9,
                                         "total_no_proposed_residential_units":
                                             5,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             5
                                     }
                                 },
                                 "description":
                                     "Construction of roof extension to create third floor with roof terrace to provide five residential units (2 x 1 bedroom, 2 x 2 bedroom, and 1 x 3 bedroom). Installation of metal fence railings at north, south, east, and west ground floor elevations.",
                                 "application_type_full":
                                     "Full planning permission",
                                 "street_name":
                                     "Lemna Road",
                                 "decision_date":
                                     "30/01/2020",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates": [[
                                             [539495.2489628, 187614.6490136],
                                             [539523.2948523, 187588.984379], [
                                                 539497.1010499, 187557.4988993
                                             ], [
                                                 539468.2614089, 187580.7822792
                                             ], [
                                                 539469.0551604, 187581.8406147
                                             ], [
                                                 539469.0551604, 187582.8989501
                                             ], [
                                                 539469.0551604, 187584.2218694
                                             ], [539468.2614089, 187585.015621],
                                             [539479.1093472, 187596.9218948], [
                                                 539495.2489628, 187614.6490136
                                             ]
                                         ]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": 0.011337, "lat": 51.569906
                                 },
                                 "actual_commencement_date":
                                     None,
                                 "site_number":
                                     "Robart House, 1",
                                 "lapsed_date":
                                     "30/01/2023",
                                 "status":
                                     "Approved"
                             }
                         },
                         {
                             "_index": "applications",
                             "_type": "_doc",
                             "_id": "Waltham_Forest-193451",
                             "_score": 6.194662,
                             "_source": {
                                 "uprn":
                                     "100022577085",
                                 "development_type":
                                     "New Build",
                                 "last_updated":
                                     "2020-11-25T13:49:28.326Z",
                                 "actual_completion_date":
                                     None,
                                 "postcode":
                                     "E17 4BZ",
                                 "application_details": {
                                     "residential_details": {
                                         "total_no_proposed_bedrooms":
                                             3,
                                         "total_no_proposed_residential_units":
                                             1,
                                         "total_no_proposed_residential_affordable_units":
                                             0,
                                         "total_no_proposed_residential_units_market_for_sale":
                                             1
                                     }
                                 },
                                 "description":
                                     "Demolition of existing garage and outbuilding to facilitate the construction of 2 storey, 3 bedroom dwellinghouse and subdivision of site/garden (Amended drawings).",
                                 "application_type_full":
                                     "Full planning permission",
                                 "street_name":
                                     "Pentire Road",
                                 "decision_date":
                                     "09/03/2020",
                                 "polygon": {
                                     "geometries": [{
                                         "coordinates": [[
                                             [538685.5760308, 190666.3343917],
                                             [538696.688553, 190669.2448142], [
                                                 538702.7739819, 190645.4322665
                                             ], [538691.1322919, 190642.521844],
                                             [538685.5760308, 190666.3343917]
                                         ]],
                                         "type": "Polygon"
                                     }],
                                     "type": "geometrycollection"
                                 },
                                 "centroid": {
                                     "lon": 9.85E-4, "lat": 51.597699
                                 },
                                 "actual_commencement_date":
                                     None,
                                 "site_number":
                                     "40",
                                 "lapsed_date":
                                     "09/03/2023",
                                 "status":
                                     "Approved"
                             }
                         }]
            }
        }
