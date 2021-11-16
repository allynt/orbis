import React from 'react';

import * as data from '../../mock-data/waltham-forest/mock_total_housing_delivery';
import { GroupedBarChart } from './grouped-bar-chart.component';

export default {
  title: 'Dashboards/Widgets/Grouped Bar Chart',
};

const mockData = data.properties[0].data.reduce(
  (acc, cur) => ({
    gross: [...acc.gross, { x: cur.Year, y: cur['Total Gross'] }],
    net: [...acc.gross, { x: cur.Year, y: cur['Total Gross'] }],
  }),
  { gross: [], net: [] },
);

const Template = args => {
  return <GroupedBarChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  xLabel: 'Year',
  yLabel: data.properties[0].name,
  data: [...Object.values(mockData)],
};
