import React from 'react';

import * as data from '../../mock-data/waltham-forest/mock_total_housing_delivery';
import { WFCGroupedDataTransformer } from '../../WalthamForest/utils';
import { GroupedBarChart } from './grouped-bar-chart.component';

export default {
  title: 'Dashboards/Widgets/Grouped Bar Chart',
};

const Template = args => {
  return <GroupedBarChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  xLabel: 'Year',
  yLabel: data.properties[0].name,
  data: WFCGroupedDataTransformer(data.properties[0].data),
};
