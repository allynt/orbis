import React from 'react';

import { Chart } from './chart.component';

const data = new Array(10).fill(undefined).map((_, i) => ({
  value: i,
  square: i * i,
  exponent: i ** i,
  sum: i + i,
}));

export default {
  title: 'Dashboards/Widgets/Chart',
};

const Template = args => {
  return <Chart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  data,
  x: 'value',
  ranges: ['value', 'square', 'sum'],
  xLabel: 'Financial Year',
  yLabel: 'Affordable Housing %age',
  renderRange: () => {},
};
