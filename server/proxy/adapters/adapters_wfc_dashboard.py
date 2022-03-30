"""
Uses the api at: https://planningdata.london.gov.uk/api-guest/applications/_search
"""
import json

from collections import defaultdict, Counter
from operator import itemgetter

from django.core.exceptions import BadRequest

from datetime import datetime
from .adapters_base import BaseProxyDataAdapter


DATE_FORMAT = "%d/%m/%Y"
MONTH_FORMAT = "%b"

AFFORDABLE_TYPES = ["Affordable Rent (not at LAR benchmark rents)", "London Affordable Rent"]
AFFORDABLE_LABEL = "Affordable Housing"
TENURE_TYPES = {
    "Affordable Rent (not at LAR benchmark rents)": None,
    "London Affordable Rent": None,
    "Intermediate": None,
    "Intermediate Other": None,
    "Market for sale": None,
    "Social Rent": None,
}

FINANCIAL_DATE_PREFIX = "05/04/"

MONTH_STR = "Month"
YEAR_STR = "Year"

def get_hits_details(hits_data, date_type):
    """
    Get the year as a string and the residential units from hits data.
    """
    details = {
        "year": hits_data["_source"][date_type],
        "residential_units": hits_data.get("_source", {}).get("application_details", {}).get("residential_details", {}).get("residential_units", {})
    }

    return details

def get_dates(year_string):
    """
    Get dates used by strategy functions.
    """
    year = datetime.strptime(year_string, DATE_FORMAT).year

    start_date = datetime.strptime(FINANCIAL_DATE_PREFIX + str(year), DATE_FORMAT)

    dates = {
        "year": year,
        "actual_date": datetime.strptime(year_string, DATE_FORMAT),
        "start_date": start_date,
        "end_date": start_date.replace(year=start_date.year + 1)
    }

    return dates

def get_financial_year(dates):
    financial_year = None
    if (dates["start_date"] <= dates["actual_date"] <= dates["end_date"]):
        financial_year = dates["year"]
    elif (dates["actual_date"] < dates["start_date"]):
        financial_year = dates["year"] - 1
    elif (dates["actual_date"] > dates["end_date"]):
        financial_year = dates["year"] + 1

    return financial_year

def housing_delivery_by_tenure(hits_data):
    """
    Function to transform raw data into the shape needed for this chart.
    """
    # Iterate over each hit, to get housing deliveries by tenure
    totals_per_year = {}
    for i, rd in enumerate(hits_data, start=1):
        details = get_hits_details(rd, "actual_completion_date")
        year_string, residential_units = itemgetter("year", "residential_units")(details)

        if year_string is not None and residential_units is not None:
            dates = get_dates(year_string)
            financial_year = get_financial_year(dates)

            # Get existing year if it already exists.
            year_totals = totals_per_year.get(financial_year, defaultdict(int, { "startYear": financial_year }))

            for unit in residential_units:
                tenure_type = unit["tenure"]
                if year_totals[tenure_type] is not None:
                    year_totals[tenure_type] += 1
                else:
                    year_totals[tenure_type] = 1

            merged_year_totals = { **TENURE_TYPES, **year_totals }
            totals_per_year[financial_year] = merged_year_totals

    return totals_per_year

def affordable_housing_delivery(hits_data):
    """
    Function to transform raw data into the shape needed for this chart.
    """
    # Iterate over each hit, to get housing deliveries by tenure
    affordable_housing = {}
    for i, rd in enumerate(hits_data, start=1):
        details = get_hits_details(rd, "actual_completion_date")
        year_string, residential_units = itemgetter("year", "residential_units")(details)

        if year_string is not None and residential_units is not None:
            dates = get_dates(year_string)
            financial_year = get_financial_year(dates)

            # Get existing year if it already exists.
            year_totals = affordable_housing.get(financial_year, defaultdict(int, { "startYear": financial_year }))

            for unit in residential_units:
                tenure_type = unit["tenure"]
                if tenure_type in AFFORDABLE_TYPES:
                    year_totals[AFFORDABLE_LABEL] += 1

            affordable_housing[financial_year] = year_totals

    # If a year has no `Affordable Housing`, set it to `None`.
    sanitized_affordable_housing = { key: value if AFFORDABLE_LABEL in value else { "startYear": value["startYear"], AFFORDABLE_LABEL: None } for key, value in affordable_housing.items() }

    return sanitized_affordable_housing

def housing_approval_over_time(hits_data):
    """
    Function to transform raw data into the shape needed for this chart.
    """
    # Iterate over each hit, to get housing deliveries by tenure
    approvals_over_time = {}
    for i, rd in enumerate(hits_data, start=1):
        details = get_hits_details(rd, "decision_date")
        year_string, residential_units = itemgetter("year", "residential_units")(details)

        if year_string is not None and residential_units is not None:
            dates = get_dates(year_string)
            year = itemgetter("year")(dates)

            month = datetime.strptime(year_string, DATE_FORMAT).strftime((MONTH_FORMAT))

            # Get existing year if it already exists.
            year_totals = approvals_over_time.get(month, defaultdict(int, { MONTH_STR: month }))

            for _ in residential_units:
                year_totals[str(year)] += 1

            approvals_over_time[month] = year_totals

    return approvals_over_time

def merge_data(api_data, mock_data, strategy):
    """
    Merge and sort the data, based on the strategy parameter.
    """
    merged_data = None
    if strategy == MONTH_STR:
        # Merge live API data with our own data.
        combined_data = { d[MONTH_STR] : d for d in mock_data}

        for key in combined_data.keys():
            combined_value = combined_data[key]
            combined_value.update(api_data[key])

        # Transform data from dictionary to array and sort data by year.
        merged_data = sorted(combined_data.values(), key=lambda datum: datetime.strptime(datum[MONTH_STR], "%b"))
    elif strategy == YEAR_STR:
        # Merge live API data with our own data. API data should
        # take precedence.
        combined_data = { int(d["startYear"]) : d for d in mock_data}
        combined_data.update(api_data)

        # Transform data from dictionary to array and sort data by year.
        merged_data = [combined_data[key] for key in sorted(combined_data.keys())]
    else:
        # Throw error, unknown strategy.
        raise BadRequest(f"Unknown merge strategy: {strategy}")

    return merged_data


class WFCDashboardAdapter(BaseProxyDataAdapter):

    name = "wfc"

    def process_data(self, raw_data):
        # assume raw_data is the same shape as SAMPLE_DATA
        # Get the name of the proxy, to match against the strategy to use.
        strategy = self.proxy.name
        hits_data = raw_data["hits"]["hits"]

        # Get mock data to merge with live API data.
        extra_content = json.load(self.proxy.proxy_extra_content)
        mock_data = extra_content["properties"][0]["data"]

        # Get API data.
        api_data = {}
        merged_data = {}
        if strategy == "tenure_type_housing_delivery":
            api_data = housing_delivery_by_tenure(hits_data)
            merged_data = merge_data(api_data, mock_data, YEAR_STR)
        elif strategy == "affordable_housing_delivery":
            api_data = affordable_housing_delivery(hits_data)

            # Sanitize the mock data
            sanitized = []
            for item in mock_data:
                values = [value for key, value in item.items() if key in AFFORDABLE_TYPES and value is not None]
                summed_values = sum(values) if values else None
                sanitized.append({ "startYear": int(item["startYear"]), AFFORDABLE_LABEL: summed_values })

            merged_data = merge_data(api_data, sanitized, YEAR_STR)
        elif strategy == "housing_approvals_over_time":
            monthly_api_data = housing_approval_over_time(hits_data)
            monthly_merged_data = merge_data(monthly_api_data, mock_data, MONTH_STR)

            # Calculate cumulative totals for each year.
            cumulative_totals = []
            counter = Counter()
            for approval in monthly_merged_data:
                approval_minus_month = { key: value for key, value in approval.items() if key != MONTH_STR and value != None }

                counter.update(approval_minus_month)

                cumulative_totals.append({ MONTH_STR: approval[MONTH_STR], **counter })

            merged_data = {
                "properties" : [{
                    "name": "Monthly",
                    "data": monthly_merged_data
                }, {
                    "name": "Cumulative",
                    "data": cumulative_totals
                }]
            }
        elif strategy == "progression_of_units":
            # Get last 5 years worth of data
            merged_data = mock_data[-5:]
        else:
            # Throw error, unknown strategy.
            raise BadRequest(f"Unknown adapter type: {self.proxy['name']}")

        # return data
        return merged_data

    @property
    def SAMPLE_DATA(self):
        return {
            "took": 3,
            "timed_out": False,
            "_shards": {
                "total": 1,
                "successful": 1,
                "skipped": 0,
                "failed": 0
            },
            "hits": {
                "total": {
                "value": 732,
                "relation": "eq"
                },
                "max_score": 6.4940705,
                "hits": [
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-2013_0352",
                    "_score": 6.4940705,
                    "_source": {
                    "lpa_app_no": "2013/0352",
                    "actual_completion_date": "16/10/2015",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Intermediate"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            },
                            {
                            "tenure": "Affordable Rent (not at LAR benchmark rents)"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-162043",
                    "_score": 6.4940705,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "lpa_app_no": "162043",
                    "actual_completion_date": "05/08/2018",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-130268",
                    "_score": 6.4940705,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "lpa_app_no": "130268",
                    "actual_completion_date": "10/08/2016",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Market for sale"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-162817",
                    "_score": 6.4940705,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "lpa_app_no": "162817",
                    "actual_completion_date": "30/11/2017",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-153772",
                    "_score": 6.4940705,
                    "_source": {
                    "lpa_app_no": "153772",
                    "actual_completion_date": "20/01/2016",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-2014_0982_CLE",
                    "_score": 6.4940705,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "lpa_app_no": "2014/0982/CLE",
                    "actual_completion_date": "27/06/2014",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-163760",
                    "_score": 6.4940705,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "lpa_app_no": "163760",
                    "actual_completion_date": "04/02/2019",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Market for sale"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-2014_0540_CLE",
                    "_score": 6.4940705,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "lpa_app_no": "2014/0540/CLE",
                    "actual_completion_date": "28/04/2014",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-160526",
                    "_score": 6.4940705,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "lpa_app_no": "160526",
                    "actual_completion_date": "04/03/2019",
                    "application_details": {
                        "residential_details": {
                        "residential_units": [
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            },
                            {
                            "tenure": "Market for sale"
                            }
                        ]
                        }
                    }
                    }
                },
                {
                    "_index": "applications",
                    "_type": "_doc",
                    "_id": "Waltham_Forest-153429",
                    "_score": 6.4940705,
                    "_ignored": [
                    "polygon"
                    ],
                    "_source": {
                    "lpa_app_no": "153429",
                    "actual_completion_date": "06/12/2016"
                    }
                }
                ]
            }
        }

