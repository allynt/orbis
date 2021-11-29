import React from 'react';

import * as data from '../../mock-data/waltham-forest/mock_approvals_granted';
import { HousingApprovalsComponent } from './housing-approvals.component';

export default {
  title: 'Dashboard/WalthamForest/Charts/HousingApprovals',
};

const Template = args => {
  return <HousingApprovalsComponent {...args} data={args.data} />;
};

export const Default = Template.bind({});
Default.args = {
  data: data.properties,
  x: 'Month',
  ranges: ['2019', '2020'],
  xLabel: 'Year',
  yLabel: 'No. Housing Approvals Granted',
};
