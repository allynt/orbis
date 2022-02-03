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
];

export const targetDatasets = {
  totalHousing:
    'Total Housing Test Target For Each of The Last 5 Financial Years',
  marketHousing:
    'Market Housing Targets For Each of The Previous 10 Financial Years',
  affordableHousing:
    'Affordable Housing % Delivery Target For The Previous 10 Financial Years',
  intermediateDelivery:
    'Intermediate % Delivery Target For the Previous 10 Financial Years',
  sociallyRented:
    'Socially Rented % Delivery Target For The Previous 10 Financial Years',
  privateRental:
    'Private Rental Sector % Delivery Target For The Previous 10 Financial Years',
};

export const targetInputFields = [
  '2011-2012',
  '2012-2013',
  '2013-2014',
  '2014-2015',
  '2015-2016',
  '2016-2017',
  '2017-2018',
  '2018-2019',
  '2019-2020',
  '2020-2021',
];

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

export const DeliverableSupplySummaryTypes = [
  'Large Sites - With Planning Permission',
  'Non Self Contained Accomodation With Planning Permission',
  'Windfall Allowance From Small Sites',
  'Sites on the Brownfield Land Site',
];
