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

export const progressionVsPlanningOptions = {
  'Ahead of Schedule': 'Ahead of Schedule',
  'Behind Schedule': 'Behind Schedule',
  'On Track': 'On Track',
};

export const progressionVsPlanningPalette = {
  'Ahead of Schedule': '#37e5d8',
  'Behind Schedule': '#d6ea69',
  'On Track': '#05c3ff',
};

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
      '% of Houses Delivered So Far out of Previous 5 Financial Years Target.',
    info: 'Some info',
    name: 'Housing Delivery',
  },
  intermediate: {
    title:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    info: 'Some info',
    name: 'Intermediate Delivery',
  },
  marketHousing: {
    title: '% Market Houses Delivered so Far Out of Current Financial Year',
    info: 'Some info',
    name: 'Market Housing',
  },
  socialRented: {
    title: '% Social Rented Houses Delivered so Far Out of Yearly Target',
    info: 'Some info',
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

export const ALL_TYPES = 'Show All';
