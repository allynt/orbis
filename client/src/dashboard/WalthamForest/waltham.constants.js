export const inputErrorMessage = 'Only number values are permitted.';

// mock data tenure types
// export const housingTenureTypes = {
//   affordableHousing: 'Affordable Rent',
//   intermediateDelivery: 'Intermediate',
//   marketHousing: 'Market',
//   sociallyRented: 'Social Rented',
//   privateRental: 'Private Rented Sector',
// };

// live data tenure types
export const housingTenureTypes = {
  affordableHousing: 'Affordable Rent (not at LAR benchmark rents)',
  affordableHousingLondon: 'London Affordable Rent',
  intermediateDelivery: 'Intermediate',
  intermediateOther: 'Intermediate Other',
  marketHousing: 'Market for sale',
  sociallyRented: 'Social Rent',
};

export const progressionVsPlanningTypes = [
  'Units Ahead of Schedule',
  'Units Behind Schedule',
  'Units on Track',
];

export const progressionVsPlanningOptions = {
  aheadOfSchedule: 'Ahead of Schedule',
  behindSchedule: 'Behind Schedule',
  onTrack: 'On Track',
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

// mock data
// export const walthamApiMetadata = [
//   {
//     datasetName: 'ApprovalsGranted',
//     url: '/wfc/mock/approvals_granted/v1/',
//     apiSourceId: 'wfc/mock/approvals_granted/v1',
//   },
//   {
//     datasetName: 'ProgressionVsPlanning',
//     url: '/wfc/mock/progression_vs_planning_schedule/v1/',
//     apiSourceId: 'wfc/mock/progression_vs_planning_schedule/v1',
//   },
//   {
//     datasetName: 'TenureHousingDelivery',
//     url: '/wfc/mock/tenure_type_housing_delivery/v1/',
//     apiSourceId: 'wfc/mock/tenure_type_housing_delivery/v1',
//   },
//   {
//     datasetName: 'TotalHousingDelivery',
//     url: '/wfc/mock/total_housing_delivery/v1/',
//     apiSourceId: 'wfc/mock/total_housing_delivery/v1',
//   },
//   {
//     datasetName: 'DeliverableSupplySummary',
//     url: '/wfc/mock/deliverable_supply_summary/v1/',
//     apiSourceId: 'wfc/mock/deliverable_supply_summary/v1',
//   },
//   {
//     datasetName: 'AffordableHousingDelivery',
//     url: '/wfc/mock/affordable_housing_delivery/v1',
//     apiSourceId: 'wfc/mock/affordable_housing_delivery/v1',
//   },
// ];

// live data
export const walthamApiMetadata = [
  {
    datasetName: 'TenureHousingDelivery',
    url: '/wfc/proxy/tenure_type_housing_delivery/latest/',
    apiSourceId: 'wfc/proxy/tenure_type_housing_delivery/latest',
  },
  {
    datasetName: 'ApprovalsGranted',
    url: '/wfc/proxy/housing_approvals_over_time/latest/',
    apiSourceId: 'wfc/proxy/housing_approvals_over_time/latest',
  },
  {
    datasetName: 'ProgressionVsPlanning',
    url: '/wfc/proxy/progression_of_units/latest/',
    apiSourceId: 'wfc/proxy/progression_of_units/latest',
  },
  {
    datasetName: 'AffordableHousingDelivery',
    url: '/wfc/proxy/affordable_housing_delivery/latest/',
    apiSourceId: 'wfc/proxy/affordable_housing_delivery/latest',
  },
  // TODO: TotalHousingDelivery is still mock data
  {
    datasetName: 'TotalHousingDelivery',
    url: '/wfc/mock/total_housing_delivery/v1/',
    apiSourceId: 'wfc/mock/total_housing_delivery/v1',
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
  privateRental:
    'Private Rented Housing Targets for previous 5 financial years',
  affordableHousingPercentage:
    'Affordable Housing Targets for previous 10 financial years',
};

export const HOUSING_APPROVAL_DATA_TYPES = {
  monthly: 'Monthly',
  cumulative: 'Cumulative',
};

export const PROGRESS_CHART_DATA = {
  totalHousing: {
    title:
      'Total units delivered of housing delivery target for last 5 financial years',
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

export const ALL_TYPES = 'Show All';

// start index not included, so must be one less than target number,
// for example, 5-year range would be 4, like below.
export const WALTHAM_FILTER_RANGE = 4;
