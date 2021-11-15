import React from 'react';

import { COLORS } from '../../constants';
import { Widget } from '../widget.component';
import { ProgressIndicatorChart } from './progress-indicator-chart.component';

export default {
  title: 'Dashboards/Widgets/Progress Indicator Chart',
};

const Template = ({ source }) => {
  return (
    <Widget title={source?.title} info={source?.info}>
      <ProgressIndicatorChart source={source} />
    </Widget>
  );
};

export const Default = Template.bind({});
Default.args = {
  source: {
    name: 'Housing Delivery',
    title:
      '% Houses Delivered so Far Out of Housing Delivery Target For Previous 5 Financial Years.',
    info:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni, nisi excepturi. Nemo quia iusto, vel tempora deleniti suscipit rerum soluta inventore consectetur ab consequatur doloribus beatae vero saepe ex magnam.',
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

export const NoInfo = Template.bind({});
NoInfo.args = {
  source: {
    ...Default.args.source,
    info: undefined,
  },
};
