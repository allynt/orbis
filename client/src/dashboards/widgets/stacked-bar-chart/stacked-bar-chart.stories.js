import React from 'react';

import faker from 'faker';

import { StackedBarChart } from './stacked-bar-chart.component';

export default { title: 'Dashboards/Widgets/StackedBarChart' };

const data = Array(5)
  .fill()
  .map((_, i) => ({
    year: `20${i + 17}`,
    'Units ahead of Schedule': faker.random.number(1000),
    'Units Behind Schedule': faker.random.number(1000),
    'Units on Schedule': faker.random.number(1000),
  }));

const Template = args => <StackedBarChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  data,
  ranges: [
    'Units ahead of Schedule',
    'Units Behind Schedule',
    'Units on Schedule',
  ],
  x: 'year',
  xLabel: 'Financial Year',
  yLabel: 'Number of Units',
};
