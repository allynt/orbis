import React from 'react';

import { LineChart } from './line-chart.component';

const data = new Array(10).fill(undefined).map((_, i) => ({
  value: i,
  square: i * i,
  exponent: i ** i,
  sum: i + i,
}));

export default {
  title: 'Dashboards/Widgets/Line Chart',
};

const Template = args => {
  return <LineChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  data,
  x: 'value',
  ranges: ['value', 'square', 'sum'],
};
