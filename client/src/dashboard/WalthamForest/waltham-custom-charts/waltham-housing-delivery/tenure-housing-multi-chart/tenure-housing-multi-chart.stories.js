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
  { Year: '2016-2017', Intermediate: 297, Market: 334 },
  { Year: '2017-2018', Intermediate: 120, Market: 295 },
  { Year: '2018-2019', Intermediate: 347, Market: 512 },
  { Year: '2019-2020', Intermediate: 511, Market: 398 },
  { Year: '2020-2021', Intermediate: 490, Market: 200 },
];

const Template = () => (
  <TenureHousingMultiChart apiData={stackedData} userTargetData={lineData} />
);

export const Default = Template.bind({});
