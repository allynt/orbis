export const inputErrorMessage = 'Only number values are permitted.';

export const walthamApiMetadata = [
  {
    datasetName: 'TargetProgress',
    url: 'proxy/data/wfc/mock/target_progress/v1/',
  },
  {
    datasetName: 'ApprovalsGranted',
    url: 'proxy/data/wfc/mock/approvals_granted/v1/',
  },
  {
    datasetName: 'ProgressionVsPlanning',
    url: 'proxy/data/wfc/mock/progression_vs_planning_schedule/v1/',
  },
  {
    datasetName: 'TenureHousingDelivery',
    url: 'proxy/data/wfc/mock/tenure_type_housing_delivery/v1/',
  },
  {
    datasetName: 'TotalHousingDelivery',
    url: 'proxy/data/wfc/mock/total_housing_delivery/v1/',
  },
];

export const targetDatasets = {
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
  '2011 - 2012',
  '2012 - 2013',
  '2013 - 2014',
  '2014 - 2015',
  '2015 - 2016',
  '2016 - 2017',
  '2017 - 2018',
  '2018 - 2019',
  '2019 - 2020',
  '2020 - 2021',
];

export const HOUSING_APPROVAL_BUTTON_LABELS = [
  { label: 'Monthly' },
  { label: 'Cumulative' },
];
