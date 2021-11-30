import React from 'react';

import { HousingTenureMultiChart } from './housing-tenure-multi-chart.component';

export default {
  title: 'Dashboard/Waltham Forest/Charts/HousingTenureMultiChart',
};

const lineData = [
  { x: '2016-2017', y: 1490 },
  { x: '2017-2018', y: 1275 },
  { x: '2018-2019', y: 1560 },
  { x: '2019-2020', y: 1452 },
  { x: '2020-2021', y: 1120 },
];

// BREAKS WITH STRING NUMBERS

const stackedData = [
  { Year: '2016-2017', Intermediate: 297, Market: 334, Target: 1490 },
  { Year: '2017-2018', Intermediate: 120, Market: 295, Target: 1275 },
  { Year: '2018-2019', Intermediate: 347, Market: 512, Target: 1560 },
  { Year: '2019-2020', Intermediate: 511, Market: 398, Target: 1452 },
  { Year: '2020-2021', Intermediate: 490, Market: 200, Target: 1120 },
];

const Template = () => {
  return <HousingTenureMultiChart data={stackedData} />;
};

export const Default = Template.bind({});
