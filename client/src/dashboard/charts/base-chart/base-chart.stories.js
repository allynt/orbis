import React from 'react';

import { BaseChart } from './base-chart.component';

export default {
  title: 'Dashboard/Charts/Base Chart',
};

const Template = args => {
  return <BaseChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  xLabel: 'Financial Year',
  yLabel: 'Affordable Housing %age',
  renderChart: () => {},
};
