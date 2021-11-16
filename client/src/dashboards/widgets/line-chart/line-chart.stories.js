import React from 'react';

import * as data from '../../mock-data/waltham-forest/mock_approvals_granted';
import { LineChart } from './line-chart.component';

export default {
  title: 'Dashboards/Widgets/Line Chart',
};

// TODO: Breaks if some range values are missing (some only have 2019/2020, no 2021)

const Template = args => {
  return <LineChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  data: data.properties.find(p => p.name === 'Monthly').data,
  x: 'Month',
  ranges: ['2019', '2020'],
  xLabel: 'Year',
  yLabel: 'Data Property Name / Unit',
};
