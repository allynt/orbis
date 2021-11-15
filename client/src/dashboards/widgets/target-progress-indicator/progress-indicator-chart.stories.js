import React from 'react';

import { COLORS } from '../../constants';
import { ProgressIndicatorChart } from './progress-indicator-chart.component';

export default {
  title: 'Dashboards/Widgets/Progress Indicator Chart',
};

const Template = ({ source }) => <ProgressIndicatorChart source={source} />;

export const Default = Template.bind({});
Default.args = {
  source: {
    name: 'Housing Delivery',
    color: COLORS.blue,
    target: 300,
    progress: 240,
  },
};

export const NoProgressOrTarget = Template.bind({});
NoProgressOrTarget.args = {
  source: {
    ...Default.args.source,
    progress: undefined,
  },
};
