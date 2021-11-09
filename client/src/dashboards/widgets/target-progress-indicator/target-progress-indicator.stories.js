import React from 'react';

import WidgetWrapper from '../../components/widget-wrapper.component';
import { TargetProgressIndicator } from './target-progress-indicator.component';

export default {
  title: 'Dashboard/Widgets/Target Progress Indicator',
};

const DEFAULT_TITLE =
  '% Houses Delivered so Far Out of Housing Delivery Target For Previous 5 Financial Years.';

const DEFAULT_INFO =
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni, nisi excepturi. Nemo quia iusto, vel tempora deleniti suscipit rerum soluta inventore consectetur ab consequatur doloribus beatae vero saepe ex magnam.';

const Template = ({ source }) => {
  return (
    <WidgetWrapper title={source?.title} info={source?.info}>
      <TargetProgressIndicator source={source} />
    </WidgetWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  source: {
    name: 'Housing Delivery',
    title: DEFAULT_TITLE,
    info: DEFAULT_INFO,
    target: 300,
    progress: 240,
  },
};

export const NoProgress = Template.bind({});
NoProgress.args = {
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

export const NoSource = Template.bind({});
NoSource.args = {
  source: undefined,
};
