import React from 'react';

import { groupedDataTransformer } from 'dashboard/WalthamForest/utils';

import { TotalHousingMultiChart } from './total-housing-multi-chart.component';

export default {
  title:
    'Dashboard/Waltham Forest/Charts/HousingDelivery/TotalHousingMultiChart',
};

const userTargetData = [
  { x: '2014-2015', y: 510 },
  { x: '2015-2016', y: 390 },
  { x: '2016-2017', y: 490 },
  { x: '2017-2018', y: 275 },
  { x: '2018-2019', y: 560 },
  { x: '2019-2020', y: 452 },
  { x: '2020-2021', y: 120 },
];

export const groupedApiData = groupedDataTransformer([
  {
    Year: '2014-2015',
    'Total Gross': 743,
    'Total Net': 677,
  },
  {
    Year: '2015-2016',
    'Total Gross': 1089,
    'Total Net': 901,
  },
  {
    Year: '2016-2017',
    'Total Gross': 1114,
    'Total Net': 997,
  },
  {
    Year: '2017-2018',
    'Total Gross': 1331,
    'Total Net': 1103,
  },
  {
    Year: '2018-2019',
    'Total Gross': 1349,
    'Total Net': 1211,
  },
  {
    Year: '2019-2020',
    'Total Gross': 1468,
    'Total Net': 1032,
  },
  {
    Year: '2020-2021',
    'Total Gross': 907,
    'Total Net': 899,
  },
]);

const Template = args => <TotalHousingMultiChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  apiData: groupedApiData,
  userTargetData,
};

export const NoTargetData = Template.bind({});
NoTargetData.args = {
  apiData: groupedApiData,
};

export const BigDataRange = Template.bind({});
BigDataRange.args = {
  apiData: groupedApiData,
  userTargetData: [
    { x: '2014-2015', y: 3620 },
    { x: '2015-2016', y: 3460 },
    { x: '2016-2017', y: 3490 },
    { x: '2017-2018', y: 3275 },
    { x: '2018-2019', y: 3560 },
    { x: '2019-2020', y: 3452 },
    { x: '2020-2021', y: 3120 },
  ],
};

export const MissingValues = Template.bind({});
MissingValues.args = {
  apiData: groupedApiData,
  userTargetData: [
    { x: '2014-2015', y: 620 },
    { x: '2016-2017', y: 490 },
    { x: '2018-2019', y: 560 },
    { x: '2020-2021', y: 120 },
  ],
};
