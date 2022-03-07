import React from 'react';

import ProtectedFeatureButtonGroup from './protected-feature-button-group.component';

export default {
  title: 'Dashboard/Nature Scotland/Protected Feature ButtonGroup',
  argTypes: { onSubmit: { action: 'onSubmit' } },
  args: {
    buttons: [
      { label: 'button one' },
      { label: 'button two' },
      { label: 'button three' },
    ],
  },
};

const Template = args => <ProtectedFeatureButtonGroup {...args} />;

export const Default = Template.bind({});
