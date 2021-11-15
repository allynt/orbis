import React from 'react';

import { GroupedBarChart } from './grouped-bar-chart.component';

export default {
  title: 'Dashboards/Widgets/Grouped Bar Chart',
};

const data = new Array(5).fill(undefined).map((_, i) => [
  { x: 1, y: Math.floor(Math.random() * 100) },
  { x: 2, y: Math.floor(Math.random() * 100) },
  { x: 3, y: Math.floor(Math.random() * 100) },
]);

const Template = args => {
  return <GroupedBarChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  xLabel: 'This is X label',
  yLabel: 'This is Y label',
  data,
};
