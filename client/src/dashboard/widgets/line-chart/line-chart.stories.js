import React from 'react';

import * as lineData from '../../mock-data/waltham-forest/mock_approvals_granted';
import { lineDataTransformer } from '../../WalthamForest/utils';
import { LineChart } from './line-chart.component';

export default {
  title: 'Dashboard/Widgets/Line Chart',
};

const data = lineData.properties.find(p => p.name === 'Monthly').data;

const Template = args => {
  return <LineChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  data: lineDataTransformer(data),
  x: 'Month',
  ranges: ['2019', '2020', '2021'],
  xLabel: 'Year',
  yLabel: 'Data Property Name / Unit',
};
