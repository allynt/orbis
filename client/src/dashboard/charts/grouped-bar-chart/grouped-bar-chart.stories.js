import React from 'react';

import * as groupedData from '../../mock-data/waltham-forest/mock_total_housing_delivery';
import { groupedDataTransformer } from '../../WalthamForest/utils';
import { GroupedBarChart } from './grouped-bar-chart.component';

export default {
  title: 'Dashboard/Charts/Grouped Bar Chart',
};

const Template = args => {
  return <GroupedBarChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  xLabel: 'Year',
  yLabel: groupedData.properties[0].name,
  data: groupedDataTransformer(groupedData.properties[0].data),
};
