export const inputErrorMessage = 'Only number values are permitted.';

export const housingTenureTypes = {
  affordableHousing: 'Affordable Rent',
  intermediateDelivery: 'Intermediate',
  marketHousing: 'Market',
  sociallyRented: 'Social Rented',
  privateRental: 'Private Rented Sector',
};

export const progressionVsPlanningTypes = [
  'Units Ahead of Schedule',
  'Units Behind Schedule',
  'Units on Schedule',
];

export const TENURE_DATA_TYPES = {
  gross: 'Gross',
  net: 'Net',
};

export const TARGET_LEGEND_DATA = {
  name: 'Housing Requirement',
  color: '#d13aff',
};

export const walthamApiMetadata = [
  {
    datasetName: 'ApprovalsGranted',
    url: '/wfc/mock/approvals_granted/v1/',
  },
  {
    datasetName: 'ProgressionVsPlanning',
    url: '/wfc/mock/progression_vs_planning_schedule/v1/',
  },
  {
    datasetName: 'TenureHousingDelivery',
    url: '/wfc/mock/tenure_type_housing_delivery/v1/',
  },
  {
    datasetName: 'TotalHousingDelivery',
    url: '/wfc/mock/total_housing_delivery/v1/',
  },
  {
    datasetName: 'DeliverableSupplySummary',
    url: '/wfc/mock/deliverable_supply_summary/v1/',
  },
  {
    datasetName: 'AffordableHousingDelivery',
    url: '/wfc/mock/affordable_housing_delivery/v1',
  },
];

export const targetDatasets = {
  totalHousing:
    'Total housing test target for each of the last 5 financial years',
  sociallyRented:
    'Social Rented Housing Targets for previous 5 financial years',
  marketHousing: 'Market Housing Targets for previous 5 financial years',
  intermediateDelivery:
    'Intermediate Housing Targets for previous 5 financial years',
  affordableHousing:
    'Affordable Housing Targets for previous 5 financial years',
  privateRental:
    'Private Rented Housing Targets for previous 5 financial years',
  affordableHousingPercentage:
    'Affordable Housing % delivery target for the previous 10 financial years',
};

export const HOUSING_APPROVAL_DATA_TYPES = {
  monthly: 'Monthly',
  cumulative: 'Cumulative',
};

export const LAST_5_YEARS = [
  '2016-2017',
  '2017-2018',
  '2018-2019',
  '2019-2020',
  '2020-2021',
];

export const PROGRESS_CHART_DATA = {
  totalHousing: {
    title:
      'Total units delivered so far out of the housing delivery target for previous 5 financial years',
    info: 'The percentage of housing units delivered in the previous 5 years out of the sum of the housing delivery targets for the previous 5 financial years (inc. current year).',
    name: 'Housing Delivery',
  },
  intermediate: {
    title:
      'Intermediate units delivered so far out of current financial year target',
    info: 'The percentage of intermediate housing units delivered in the current financial year so far out of the target for intermediate housing units for the same year.',
    name: 'Intermediate Delivery',
  },
  marketHousing: {
    title: 'Market units delivered so far out of current financial year target',
    info: 'The percentage of market housing units delivered in the current financial year so far out of the target for intermediate housing units for the same year.',
    name: 'Market Housing',
  },
  socialRented: {
    title:
      'Social rented units delivered so far out of current financial year target',
    info: 'The percentage of social rented housing units delivered in the current financial year so far out of the target for intermediate housing units for the same year.',
    name: 'Socially Rented',
  },
};

export const deliverableSupplySummaryTypes = [
  'Large Sites - With Planning Permission',
  'Non Self Contained Accomodation With Planning Permission',
  'Windfall Allowance From Small Sites',
  'Sites on the Brownfield Land Site',
];

export const tooltipFlyoutStyle = {
  stroke: 'none',
  fill: '#f6be00',
};

export const yellowStyle = {
  data: { stroke: '#f6be00' },
};
