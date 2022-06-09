"""
Uses the api at: https://planningdata.london.gov.uk/api-guest/applications/_search
"""
import json
import pandas as pd

from .adapters_base import BaseProxyDataAdapter

DEFAULT_PARAMS = {
    "start_date": "01/04/2013",
    "end_date": "31/03/2023",
    "values_only": False,
    "widgets": ['totals', 'tenure', 'approvals', 'affordable'],
    "valid_tenures": [
        'Market for sale',
        'Intermediate',
        'Social Rent',
        'Affordable Rent (not at LAR benchmark rents)',
        'Intermediate Other',
        'London Affordable Rent'
    ],
    "affordable_tenures": [
        "Affordable Rent (not at LAR benchmark rents)",
        "London Affordable Rent",
    ],
    "column_names": {
        "data_type": "Data type",
        "x_value": "x value",
        "y_value": "y value",
        "data_source": "Data source",
        "tenure": "Tenure",
        "actual_completion_date": "Completion date",
        "uprn": "UPRN",
        "address": "Address",
        "lpa_app_no": "Application ID",
        "status": "Status",
        "development_type": "Development type",
    },
    "local_authority": "Waltham Forest",
    "approvals_years": [2019],
    "approvals_column_names": {
        "data_type": "Data type",
        "data_source": "Data source",
        "decision_date": "Decision date",
        "uprn": "UPRN",
        "address": "Address",
        "lpa_app_no": "Application ID",
        "status": "Status",
        "development_type": "Development type",
    }
}


def get_element_by_fn(collection, fn, default=None):
    """
    Returns the first matching element in a collection that satisfies fn;
    Used to search a list of dictionaries for a key w/ a specific value.
    """
    return next((element for element in collection if fn(element)), default)


def prepare_housing_delivery_data(df, **kwargs):

    # TODO: FILTER DATA

    start_date = kwargs.get("start_date", DEFAULT_PARAMS["start_date"])
    end_date = kwargs.get("end_date", DEFAULT_PARAMS["end_date"])
    valid_tenures = kwargs.get("valid_tenures", DEFAULT_PARAMS["valid_tenures"])

    def _get_financial_year(dt):
        year = dt.year
        if dt.month < 4:
            return f"{year-1}-{year}"
        else:
            return f"{year}-{year+1}"

    df["scheme_actual_completion_date"] = df["actual_completion_date"].copy()
    df = df.drop(columns=["actual_completion_date"])

    # expand 'residential_details' and list each unit as an entry in the df
    df = pd.concat(
        [
            df.drop(["residential_details"], axis=1),
            df["residential_details"].apply(pd.Series),
        ],
        axis=1,
    )

    df = df.explode("residential_units")

    df = pd.concat(
        [
            df.drop(["residential_units"], axis=1),
            df["residential_units"].apply(pd.Series),
        ],
        axis=1,
    )

    df = df.drop([0], axis=1)

    # fill missing completions with scheme completion date
    df.loc[df.actual_completion_date.isna(), "actual_completion_date"] = \
        df.loc[df.actual_completion_date.isna(), "scheme_actual_completion_date"]

    # Convert date fields to datetime type
    for col in df.columns:
        if "date" in col.lower():
            df[col] = pd.to_datetime(df[col], format="%d/%m/%Y")

    # clip by min actual_completion_date to cover only search period
    sd = pd.to_datetime(start_date, format="%d/%M/%Y")
    df = df.loc[df.actual_completion_date >= sd]

    # ignore unknown tenures
    df = df.loc[df.tenure.notna()].copy()

    # accept only valid tenures
    if valid_tenures is not None:
        df = df.loc[df.tenure.isin(valid_tenures)].copy()

    # define financial year column for aggregation for charts
    df['financial_year'] = df['actual_completion_date'].apply(
        _get_financial_year
    )

    df = df.convert_dtypes()
    # define address
    df["address"] = df.apply(
        lambda row: ", ".join([
            s for s in [row.site_name, row.street_name, row.postcode]
            if pd.notna(s)
        ]),
        axis=1
    )

    return df


def prepare_housing_approvals_data(df, **kwargs):
    start_date = kwargs.pop('start_date', "2014-01-01")
    end_date = kwargs.pop('end_date', "2019-12-31")
    valid_tenures = kwargs.pop("valid_tenures", DEFAULT_PARAMS["valid_tenures"])

    # begin filter data

    HOUSING_APPROVALS_COLUMNS = [
        "decision_date",
        "development_type",
        "lpa_app_no",
        "postcode",
        "residential_details",
        "site_name",
        "source",
        "status",
        "street_name",
        "uprn",
    ]
    df = df[list(set(HOUSING_APPROVALS_COLUMNS) & set(df.columns))]
    df["decision_date"] = pd.to_datetime(df["decision_date"], format="%d/%m/%Y")
    df = df.loc[(df["decision_date"] >= start_date) &
                (df["decision_date"] <= end_date)]

    # end filter data

    # expand 'residential_details' and list each unit as an entry in the df
    df = pd.concat(
        [
            df.drop(["residential_details"], axis=1),
            df["residential_details"].apply(pd.Series),
        ],
        axis=1,
    )

    df = df.explode("residential_units")

    df = pd.concat(
        [
            df.drop(["residential_units"], axis=1),
            df["residential_units"].apply(pd.Series),
        ],
        axis=1,
    )

    df = df.drop([0], axis=1)

    # Convert date fields to datetime type
    for col in df.columns:
        if "date" in col.lower():
            df[col] = pd.to_datetime(df[col], format="%d/%m/%Y")

    # ignore unknown tenures
    df = df.loc[df.tenure.notna()].copy()

    # accept only valid tenures
    if valid_tenures is not None:
        df = df.loc[df.tenure.isin(valid_tenures)].copy()

    df = df.convert_dtypes()

    # define address
    df["address"] = df.apply(
        lambda row: ", ".join([
            s for s in [row.site_name, row.street_name, row.postcode]
            if pd.notna(s)
        ]),
        axis=1
    )

    return df


# BEGIN DAN'S CODE


def gross_housing_delivery_xy_values(group):
    """Get the number of gains in the group to find gross."""
    df = group.copy()
    x = df.financial_year.values[0]
    y = (df.change_type == "Gain").sum()
    return x, y


def net_housing_delivery_xy_values(group):
    """Get the difference of gains and losses in the group to find net."""
    df = group.copy()
    x = df.financial_year.values[0]
    y = (df.change_type == "Gain").sum() \
        - (df.change_type == "Loss").sum()
    return x, y


def gross_housing_delivery_with_xy_values(group):
    """List the gross delivery with the data for each row."""
    x, y = gross_housing_delivery_xy_values(group)
    df = group.loc[group["change_type"] == "Gain"].copy()
    df['x_value'] = x
    df['y_value'] = y
    df['data_type'] = "Gross"
    df['data_source'] = "PLD"
    return df


def net_housing_delivery_with_xy_values(group):
    """List the net delivery with the data for each row."""
    x, y = net_housing_delivery_xy_values(group)
    df = group.copy()
    df['x_value'] = x
    df['y_value'] = y
    df['data_type'] = "Net"
    df['data_source'] = "PLD"
    return df


def read_mock_data_total_delivery(mock_data):
    """Parse mock total completions data to match export format."""
    mock_total = pd.DataFrame(mock_data["properties"][0]["data"])

    # we only need the mock values (2020-2021 onwards)
    # this line shouldn't be required if the mock data was _only_ mock
    mock_total = mock_total.loc[[7, 8, 9]].copy()

    mock_data = []
    for ii in list(mock_total.index):
        mock_data.append({
            'Data type': 'Gross',
            'x value': mock_total.loc[ii, 'Year'],
            'y value': mock_total.loc[ii, 'Total Gross'],
            'Data source': 'Mock',
            'Completion date': pd.NA,
            'UPRN': pd.NA,
            'Address': pd.NA,
            'Application ID': pd.NA,
            'Status': pd.NA,
            'Development type': pd.NA
        })
    for ii in list(mock_total.index):
        mock_data.append({
            'Data type': 'Net',
            'x value': mock_total.loc[ii, 'Year'],
            'y value': mock_total.loc[ii, 'Total Net'],
            'Data source': 'Mock',
            'Completion date': pd.NA,
            'UPRN': pd.NA,
            'Address': pd.NA,
            'Application ID': pd.NA,
            'Status': pd.NA,
            'Development type': pd.NA
        })
    mock_data = pd.DataFrame(mock_data)

    return mock_data


def read_mock_data_tenure_type(mock_data):
    """Read mock tenure completions data & format to match to real data."""
    mock_tt = pd.DataFrame(mock_data['properties'][0]['data']).set_index([
        'startYear', 'Type'
    ])

    mock_data = []
    for startYear, data_type in mock_tt.index:
        fyear = f"{startYear}-{int(startYear) + 1}"
        for tenure in mock_tt.columns:
            val = mock_tt.loc[(startYear, data_type), tenure]
            mock_data.append({
                'Data type': data_type,
                'x value': fyear,
                'y value': val,
                'Data source': 'Mock',
                'Tenure': tenure,
                'Completion date': pd.NA,
                'UPRN': pd.NA,
                'Address': pd.NA,
                'Application ID': pd.NA,
                'Status': pd.NA,
                'Development type': pd.NA
            })
    mock_data = pd.DataFrame(mock_data)

    return mock_data


def read_mock_data_approvals(mock_data):
    """Parse mock approvals data into export format."""

    mock_app = pd.DataFrame(mock_data['properties'][0]['data']).set_index([
        "Month"
    ])

    mock_data = []
    for year in sorted(mock_app.columns):
        cumsum = 0
        for month in mock_app.index:
            if pd.isna(mock_app.loc[month, year]):
                break  # assumes the rest of the year is invalid!
            cumsum = cumsum + mock_app.loc[month, year]
            mock_data.append({
                "Data type": year,
                "x value": month,
                "y value (monthly)": mock_app.loc[month, year],
                "y value (cumulative)": cumsum,
                "Data source": "Mock",
                "Decision date": pd.NA,
                "UPRN": pd.NA,
                "Address": pd.NA,
                "Application ID": pd.NA,
                "Status": pd.NA,
                "Development type": pd.NA
            })
    mock_data = pd.DataFrame(mock_data)

    return mock_data


def get_housing_delivery_totals_df(
    delivery_df, groupby_columns, filter_on, **params
):
    r"""List unit completions w/ gross & net totals by tenure & financial year.

    Parameters
    ----------
    delivery_df : :class: `~pd.DataFrame`
        Dataframe as returned by :function: `get_housing_delivery_data`.
    column_names : optional, dict
        Mapping of PLD and locally defined column names to human readable,
        ready for output ones. This is used to define which columns to keep as
        well as what to rename them.

    Returns
    -------
    tt_df : :class: `~pd.DataFrame`
        Data is returned in dataframe with the specified column names to then
        be combined with any relevant mock data before being exported.
    """
    column_names = params.pop('column_names', None)
    if column_names is None:
        column_names = {
            "data_type": "Data type",
            "x_value": "x value",
            "y_value": "y value",
            "data_source": "Data source",
            "tenure": "Tenure",
            "actual_completion_date": "Completion date",
            "uprn": "UPRN",
            "address": "Address",
            "lpa_app_no": "Application ID",
            "status": "Status",
            "development_type": "Development type"
        }
    uprn = column_names['uprn']
    completion_date = column_names['actual_completion_date']
    # get gross values
    tenure_type_df = delivery_df.groupby(groupby_columns).apply(
        gross_housing_delivery_with_xy_values
    )
    # get net values and combine these with gross into one dataframe
    tenure_type_df = pd.concat([
        tenure_type_df,
        delivery_df.groupby(groupby_columns
                           ).apply(net_housing_delivery_with_xy_values)
    ],
                               axis=0)
    if filter_on is not None:
        labels = list(filter_on.keys())
        for label in labels:
            tenure_type_df = tenure_type_df.loc[tenure_type_df[label].isin(
                filter_on[label]
            )]
    # rename columns and trim the excess
    tt_df = tenure_type_df.loc[:, list(column_names.keys())].rename(
        columns=column_names
    ).convert_dtypes()

    # UPRN as integer to avoid strings of floats which don't make sense to user
    tt_df[uprn] = tt_df[uprn].astype(float).astype(pd.Int64Dtype())
    # isoformat date
    tt_df[completion_date] = tt_df[completion_date].dt.strftime(
        "%Y-%m-%dT%H:%M:%S.000Z"
    )

    return tt_df


def get_total_housing_delivery_data(hd_df, mock_data=None, **params):
    """Total units per financial year listed with completions data.

    Parameters
    ----------
    hd_df : :class: `~pd.DataFrame`
        Dataframe of housing delivery data returned by function
        `get_housing_delivery_data`.
    params : dict
        Input parameters dict which includes parameters: 'column_names' and
        'mock_completions_path'.

    Returns
    -------
    totals_df : :class: `~pd.DataFrame`
        Data is returned in dataframe from `get_housing_delivery_totals_df`
        and combined with any relevant mock data into format expected for
        exporting.
    """

    groupby_columns = ["financial_year"]
    filter_on = None
    totals_df = get_housing_delivery_totals_df(
        hd_df, groupby_columns, filter_on, **params
    )

    # append mock data if provided
    if mock_data is not None:
        mock_totals_df = read_mock_data_total_delivery(mock_data)
        max_date = pd.to_datetime(totals_df['Completion date'].max())
        # find the latter year of the latest financial year
        if max_date.month > 3:
            end_year = max_date.year + 1
        else:
            end_year = max_date.year
        end_years_mock = mock_totals_df['x value'].apply(lambda x: int(x[-4:]))
        # we only want to mock data into the future
        if (end_year >= end_years_mock.min()):
            mock_totals_df = mock_totals_df.loc[end_years_mock > end_year]

        totals_df = pd.concat([totals_df, mock_totals_df])

    return totals_df


def get_housing_delivery_by_tenure_type_data(hd_df, mock_data=None, **params):
    """Total units per tenure and financial year listed with relevant data.

    Parameters
    ----------
    hd_df : :class: `~pd.DataFrame`
        Dataframe of housing delivery data returned by function
        `get_housing_delivery_data`.
    params : dict
        Input parameters dict which includes parameters: 'column_names' and
        'mock_completions_path'.

    Returns
    -------
    tt_df : :class: `~pd.DataFrame`
        Data is returned in dataframe from `get_housing_delivery_totals_df`
        and combined with any relevant mock data into format expected for
        exporting.
    """
    groupby_columns = ["financial_year", "tenure"]
    filter_on = None
    tt_df = get_housing_delivery_totals_df(
        hd_df, groupby_columns, filter_on, **params
    )

    if mock_data is not None:
        mock_tt_df = read_mock_data_tenure_type(mock_data)
        max_date = pd.to_datetime(tt_df['Completion date'].max())
        # find the latter year of the latest financial year
        if max_date.month > 3:
            end_year = max_date.year + 1
        else:
            end_year = max_date.year
        end_years_mock = mock_tt_df['x value'].apply(lambda x: int(x[-4:]))
        # we only want to mock data into the future
        if (end_year >= end_years_mock.min()):
            mock_tt_df = mock_tt_df.loc[end_years_mock > end_year]

        tt_df = pd.concat([tt_df, mock_tt_df])

    return tt_df


def get_affordable_housing_delivery_data(hd_df, mock_data=None, **params):
    """Total affordables per financial year listed with completions data.

    Parameters
    ----------
    hd_df : :class: `~pd.DataFrame`
        Dataframe of housing delivery data returned by function
        `get_housing_delivery_data`.
    params : dict
        Input parameters dict which includes parameters: 'affordable_tenures',
        'column_names' and 'mock_completions_path'.

    Returns
    -------
    affordable_df : :class: `~pd.DataFrame`
        Data is returned in dataframe from `get_housing_delivery_totals_df`,
        filtered on to select only affordable units and combined with any
        relevant mock data into format expected for exporting.
    """

    groupby_columns = ["financial_year", "tenure"]
    affordable_tenures = params.pop("affordable_tenures", None)
    if affordable_tenures is None:
        affordable_tenures = DEFAULT_PARAMS["affordable_tenures"]
    filter_on = {"tenure": affordable_tenures, "change_type": ["Gain"]}
    affordable_df = get_housing_delivery_totals_df(
        hd_df, groupby_columns, filter_on, **params
    )

    # append mock data if path is provided
    if mock_data is not None:
        mock_tt = read_mock_data_tenure_type(mock_data)
        max_date = pd.to_datetime(mock_tt['Completion date'].max())
        # find the latter year of the latest financial year
        if max_date.month > 3:
            end_year = max_date.year + 1
        else:
            end_year = max_date.year
        end_years_mock = mock_tt['x value'].apply(lambda x: int(x[-4:]))
        # we only want to mock data into the future
        if (end_year >= end_years_mock.min()):
            mock_tt = mock_tt.loc[end_years_mock > end_year]
            mock_aff = mock_tt.loc[mock_tt.Tenure.isin(affordable_tenures)]
            aggr = {col: "first" for col in list(mock_aff.columns)}
            aggr['y value'] = 'sum'
            mock_aff = mock_aff.groupby('x value').agg(aggr).replace({
                None: pd.NA
            })

            affordable_df = pd.concat([affordable_df, mock_aff])

    affordable_df = affordable_df.rename(
        columns={"y value": "Affordable housing delivered"}
    )
    affordable_df["Data type"] = r"% of target delivered"

    return affordable_df


def get_housing_approvals_per_month_data(ha_df, mock_data=None, **params):
    """Grab approvals from PLD API and return data with monthly values.

    Parameters
    ----------
    values_only : Boolean
        Whether to aggregate data and only return the values required for the
        charts (True) or return the extended format needed for exporting (
        False).
    params : dict
        Input parameters dict which includes parameters:
        'approvals_column_names' and 'mock_approvals_path'.
    Returns
    -------
    monthly : :class: `pd.DataFrame`
        Aggregated data required to populate the approvals over time chart is
        returned in dataframe.
    OR
    app_output : :class: `~pd.DataFrame`
        Data is returned in dataframe from `get_housing_approvals_data`
        and combined with any relevant mock data into format expected for
        exporting.
    """
    # fetch housing approvals
    start_date = params.pop('start_date', DEFAULT_PARAMS['start_date'])
    end_date = params.pop('end_date', DEFAULT_PARAMS['end_date'])
    values_only = params.pop('values_only', DEFAULT_PARAMS['values_only'])

    years = params.pop('approvals_years', None)
    if years is None:
        years = list(ha_df.decision_date.dt.year.unique())

    ha_df = ha_df.loc[ha_df.decision_date.dt.year.isin(years)].copy()

    if values_only:
        # only need to provide the monthly aggregated values
        monthly = pd.DataFrame([{
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        }]).T.rename(columns={0: "Month"})
        cumulative = monthly.copy()

        for year in years:
            apps = ha_df.loc[ha_df.decision_date.dt.year == year]
            monthly[f"{year}"] = apps.groupby(
                apps.decision_date.dt.month
            )['lpa_app_no'].count().rename(index='month')
            cumulative[f"{year}"] = monthly[f"{year}"].cumsum()

        monthly["Type"] = "Monthly"
        cumulative["Type"] = "Cumulative"
        monthly = pd.concat([monthly, cumulative])

        return monthly

    data = {}
    for year in years:
        apps = ha_df.loc[ha_df.decision_date.dt.year == year]
        data[f"{year}-monthly"] = apps.groupby(
            apps.decision_date.dt.month
        )['lpa_app_no'].count().rename(index='month')
        data[f"{year}-cumulative"] = data[f"{year}-monthly"].cumsum()
    data = pd.DataFrame(data)

    ha_df['data_type'] = ha_df.decision_date.dt.year.copy()
    ha_df['x value'] = ha_df.decision_date.dt.strftime('%b').copy()
    ha_df['y value (monthly)'] = ha_df.decision_date.apply(
        lambda x: data[f"{x.year}-monthly"][x.month]
    )
    ha_df['y value (cumulative)'] = ha_df.decision_date.apply(
        lambda x: data[f"{x.year}-cumulative"][x.month]
    )
    ha_df['data_source'] = "PLD"

    column_names = params.pop('approvals_column_names', None)
    if column_names is None:
        column_names = {
            "data_type": "Data type",
            "data_source": "Data source",
            "decision_date": "Decision date",
            "uprn": "UPRN",
            "address": "Address",
            "lpa_app_no": "Application ID",
            "status": "Status",
            "development_type": "Development type"
        }
    cols = list(column_names.keys())
    cols.insert(1, 'y value (cumulative)')
    cols.insert(1, 'y value (monthly)')
    cols.insert(1, 'x value')

    app_df = ha_df.loc[:, cols].rename(columns=column_names).convert_dtypes()
    app_df["UPRN"] = app_df["UPRN"].astype(float).astype(pd.Int64Dtype())
    app_df['Decision date'] = app_df['Decision date'].dt.strftime(
        "%Y-%m-%dT%H:%M:%S.000Z"
    )  # isoformat

    # append mock data if path is provided
    if mock_data is not None:
        mock_approvals = read_mock_data_approvals(mock_data)
        end_year = pd.to_datetime(app_df['Decision date'].max()).year
        end_years_mock = mock_approvals['Data type'].apply(lambda x: int(x))
        # we only want to mock data into the future
        if (end_year >= end_years_mock.min()):
            mock_approvals = mock_approvals.loc[end_years_mock > end_year]

        app_output = pd.concat([app_df, mock_approvals])
    else:
        app_output = app_df

    return app_output


# END DAN'S CODE


class WFCExportAdapter(BaseProxyDataAdapter):

    name = "wfc-export"

    def process_data(self, raw_data):

        params = DEFAULT_PARAMS

        mock_data = json.load(self.proxy.proxy_extra_content)

        df = pd.DataFrame(
            [
                dict(
                    hit["_source"],
                    source="PLD",
                    **(hit["_source"].pop("application_details", {})),
                )
                for hit in raw_data["hits"]["hits"]
            ]
        )  # yapf: disable

        prepared_delivery_df = prepare_housing_delivery_data(df)
        prepared_approval_df = prepare_housing_approvals_data(df)

        total_housing_delivery_data_df = get_total_housing_delivery_data(
            prepared_delivery_df,
            mock_data=get_element_by_fn(
                mock_data, lambda x: x.get("key") == "total_delivery"
            ),
            **params,
        )
        total_housing_delivery_data_df["Graph Title"] = "Total Housing Delivery"

        housing_delivery_by_tenure_type_data_df = get_housing_delivery_by_tenure_type_data(
            prepared_delivery_df,
            mock_data=get_element_by_fn(
                mock_data, lambda x: x.get("key") == "tenure_type"
            ),
            **params,
        )
        housing_delivery_by_tenure_type_data_df["Graph Title"
                                               ] = "Delivery by Tenure Type"

        affordable_housing_delivery_data_df = get_affordable_housing_delivery_data(
            prepared_delivery_df,
            mock_data=get_element_by_fn(
                mock_data, lambda x: x.get("key") == "affordable_delivery"
            ),
            **params,
        )
        affordable_housing_delivery_data_df["Graph Title"
                                           ] = "Affordable housing delivery (%)"

        housing_approvals_per_month_data_df = get_housing_approvals_per_month_data(
            prepared_approval_df,
            mock_data=get_element_by_fn(
                mock_data, lambda x: x.get("key") == "approvals_granted"
            ),
            **params,
        )
        housing_approvals_per_month_data_df[
            "Graph Title"] = "No. Housing approvals granted over time"

        processed_data = [
            {
                "title": worksheet_title,
                "data": json.loads(worksheet_df.to_json(orient="records"))
            }
            for worksheet_title, worksheet_df in zip(
                [
                    "Total Delivery",
                    "Delivery by Tenure Type",
                    "Affordable housing delivery (%)",
                    "Housing approvals granted",
                ],
                [
                    total_housing_delivery_data_df,
                    housing_delivery_by_tenure_type_data_df,
                    affordable_housing_delivery_data_df,
                    housing_approvals_per_month_data_df,
                ],
            )
        ]  # yapf: disable

        return processed_data

    @property
    def SAMPLE_DATA(self):
        return [
            {
                "title": "Total Delivery",
                "data": [
                    {
                        "Graph Title": "Total Housing Delivery",
                        "Data Type": "Gross",
                        "Data Source": "PLD"
                    },
                    {
                        "Graph Title": "Total Housing Delivery",
                        "Data Type": "Net",
                        "Data Source": "Mock"
                    }
                ]
            },
            {
                "title": "Delivery By Tenure Type",
                "data": [
                    {
                        "Completion Date": "01/05/2014",
                        "UPRN": 12345,
                        "status": "Completed"
                    },
                    {
                        "Completion Date": "02/05/2014",
                        "UPRN": 67890,
                        "status": "Completed"
                    }
                ]
            }
        ]  # yapf: disable
