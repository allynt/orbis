import React from 'react';

import { groupedApiData, stackedApiData } from './story-data';
import { WalthamHousingDelivery } from './waltham-housing-delivery.component';

const userTargetData = [
  { x: '2014-2015', y: '510' },
  { x: '2015-2016', y: '390' },
  { x: '2016-2017', y: '490' },
  { x: '2017-2018', y: '275' },
  { x: '2018-2019', y: '560' },
  { x: '2019-2020', y: '452' },
  { x: '2020-2021', y: '120' },
];

export default {
  title:
    'Dashboard/Waltham Forest/Charts/HousingDelivery/WalthamHousingDelivery',
};

const userOrbState = {
  marketHousing: userTargetData,
  totalHousing: userTargetData,
};

const Template = args => <WalthamHousingDelivery {...args} />;

export const Default = Template.bind({});
Default.args = {
  totalHousingDeliveryChartData: groupedApiData,
  tenureHousingDeliveryChartData: stackedApiData,
  userOrbState,
};

export const NoTargetData = Template.bind({});
NoTargetData.args = {
  ...Default.args,
  userOrbState: undefined,
};
