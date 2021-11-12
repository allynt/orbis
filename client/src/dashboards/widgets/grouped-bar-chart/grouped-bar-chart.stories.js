import React from 'react';

import { GroupedBarChart } from './grouped-bar-chart.component';

export default {
  title: 'Dashboards/Widgets/Grouped Bar Chart',
};

const Template = args => {
  return <GroupedBarChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  data: [
    [
      { x: 1, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 9 },
    ],
    [
      { x: 2, y: 4 },
      { x: 3, y: 5 },
      { x: 4, y: 10 },
    ],
  ],
};
