import React from 'react';

import { TenureHousingMultiChart } from './tenure-housing-multi-chart.component';

export default {
  title: 'Dashboard/Waltham Forest/Charts/TenureHousingMultiChart',
};

const lineData = [
  { x: '2016-2017', y: 490 },
  { x: '2017-2018', y: 275 },
  { x: '2018-2019', y: 560 },
  { x: '2019-2020', y: 452 },
  { x: '2020-2021', y: 120 },
];

// BREAKS WITH STRING NUMBERS

const stackedData = [
  {
    Year: '2014-2015',
    'Affordable Rent': 143,
    Intermediate: 97,
    Market: 124,
    'Social Rented': 178,
    'Private Rented Sector': 201,
  },
  {
    Year: '2015-2016',
    'Affordable Rent': 321,
    Intermediate: 158,
    Market: 133,
    'Social Rented': 170,
    'Private Rented Sector': 297,
  },
  {
    Year: '2016-2017',
    'Affordable Rent': 326,
    Intermediate: 90,
    Market: 149,
    'Social Rented': 174,
    'Private Rented Sector': 371,
  },
  {
    Year: '2017-2018',
    'Affordable Rent': 295,
    Intermediate: 197,
    Market: 179,
    'Social Rented': 218,
    'Private Rented Sector': 442,
  },
  {
    Year: '2018-2019',
    'Affordable Rent': 304,
    Intermediate: 183,
    Market: 199,
    'Social Rented': 230,
    'Private Rented Sector': 433,
  },
  {
    Year: '2019-2020',
    'Affordable Rent': 416,
    Intermediate: 85,
    Market: 203,
    'Social Rented': 251,
    'Private Rented Sector': 517,
  },
  {
    Year: '2020-2021',
    'Affordable Rent': 277,
    Intermediate: 105,
    Market: 90,
    'Social Rented': 143,
    'Private Rented Sector': 292,
  },
];

const Template = () => (
  <TenureHousingMultiChart apiData={stackedData} userTargetData={lineData} />
);

export const Default = Template.bind({});
