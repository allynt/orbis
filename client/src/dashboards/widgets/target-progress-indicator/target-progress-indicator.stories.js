import React from 'react';

import { TargetProgressIndicator } from './target-progress-indicator.component';

export default {
  title: 'Dashboard/Widgets/Target Progress Indicator',
};

const Template = ({ source }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <TargetProgressIndicator source={source} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  source: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    target: 300,
    progress: 280,
  },
};

export const NoProgress = Template.bind({});
NoProgress.args = {
  source: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    target: undefined,
    progress: 122,
  },
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  source: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    target: 300,
    progress: 122,
  },
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  source: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    target: 300,
    progress: 122,
  },
};
