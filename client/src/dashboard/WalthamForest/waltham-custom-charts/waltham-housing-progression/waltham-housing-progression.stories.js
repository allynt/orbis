import React from 'react';

import * as data from 'dashboard/mock-data/waltham-forest/mock_approvals_granted';

import { HousingProgressionComponent } from './waltham-housing-progression.component';

export default {
  title: 'Dashboard/Waltham Forest/Charts/Housing Progression',
};

const Template = ({ data, ...props }) => {
  return <HousingProgressionComponent {...props} data={data} />;
};

export const Default = Template.bind({});
Default.args = {
  data: data.properties,
  x: 'Month',
  ranges: ['2019', '2020'],
  xLabel: 'Year',
  yLabel: 'No. Housing Approvals Granted',
};
