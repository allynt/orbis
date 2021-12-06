import React from 'react';

import { stackedApiData } from '../story-data';
import { TenureHousingMultiChart } from './tenure-housing-multi-chart.component';

const userTargetData = [
  { x: '2014-2015', y: 510 },
  { x: '2015-2016', y: 390 },
  { x: '2016-2017', y: 490 },
  { x: '2017-2018', y: 275 },
  { x: '2018-2019', y: 560 },
  { x: '2019-2020', y: 452 },
  { x: '2020-2021', y: 120 },
];

export default {
  title:
    'Dashboard/Waltham Forest/Charts/HousingDelivery/TenureHousingMultiChart',
};

const Template = args => <TenureHousingMultiChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  apiData: stackedApiData[0].data,
  userTargetData,
};

export const NoTargetData = Template.bind({});
NoTargetData.args = {
  apiData: stackedApiData[0].data,
};

export const BigDataRange = Template.bind({});
BigDataRange.args = {
  apiData: stackedApiData[0].data,
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
  apiData: stackedApiData[0].data,
  userTargetData: [
    { x: '2014-2015', y: 620 },
    { x: '2016-2017', y: 490 },
    { x: '2018-2019', y: 560 },
    { x: '2020-2021', y: 120 },
  ],
};
