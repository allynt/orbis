export const walthamApiMetadata = [
  {
    datasetName: 'ApprovalsGranted',
    url: './mock-data/waltham-forest/mock_approvals_granted',
  },
  {
    datasetName: 'ProgressionVsPlanning',
    url: './mock-data/waltham-forest/mock_progression_vs_planning_schedule',
  },
  {
    datasetName: 'TenureHousingDelivery',
    url: './mock-data/waltham-forest/mock_tenure_type_housing_delivery',
  },
  {
    datasetName: 'TotalHousingDelivery',
    url: './mock-data/waltham-forest/mock_total_housing_delivery',
  },
];

export const targetSelectOptions = {
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

export const targetInputFields = {
  totalHousing: [
    '2016 - 2017',
    '2017 - 2018',
    '2018 - 2019',
    '2019 - 2020',
    '2020 - 2021',
  ],
};
