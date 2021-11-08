import React from 'react';

import { TargetProgressIndicator } from './target-progress-indicator.component';

export default {
  title: 'Dashboard/Widgets/Target Progress Indicator',
};

const Template = ({ target, width }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <TargetProgressIndicator target={target} width={width} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  width: 400,
  target: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    progress: 22,
  },
};

export const NoProgress = Template.bind({});
NoProgress.args = {
  width: 400,
  target: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    progress: undefined,
  },
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  width: 200,
  target: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    progress: 22,
  },
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  width: 500,
  target: {
    name: 'Housing Delivery',
    description:
      '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
    progress: 22,
  },
};
