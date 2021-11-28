import React from 'react';

import { GaugeChart } from './gauge.component';

export default {
  title: 'Dashboard/Charts/Gauge Chart',
};

const Template = args => {
  return <GaugeChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {};
