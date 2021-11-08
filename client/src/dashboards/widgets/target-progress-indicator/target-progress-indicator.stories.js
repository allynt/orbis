import React from 'react';

import { TargetProgressIndicator } from './target-progress-indicator.component';

export default {
  title: 'Dashboard/Widgets/Target Progress Indicator',
};

const Template = ({ source, width }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <TargetProgressIndicator source={source} width={width} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  width: 400,
  source: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    target: 300,
    progress: 122,
  },
};

export const NoProgress = Template.bind({});
NoProgress.args = {
  width: 400,
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
  width: 200,
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
  width: 500,
  source: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    target: 300,
    progress: 122,
  },
};
