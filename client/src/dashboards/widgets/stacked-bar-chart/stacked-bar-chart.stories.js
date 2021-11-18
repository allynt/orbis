import React from 'react';

import * as data from '../../mock-data/waltham-forest/mock_progression_vs_planning_schedule';
import { StackedBarChart } from './stacked-bar-chart.component';

export default { title: 'Dashboards/Widgets/StackedBarChart' };

const Template = args => <StackedBarChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: data.properties[0].data,
  ranges: ['Ahead of Schedule', 'Behind Schedule', 'On Track'],
  x: 'Year',
  xLabel: 'Financial Year',
  yLabel: data.properties[0].name,
};
