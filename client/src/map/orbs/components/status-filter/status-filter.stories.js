import React from 'react';

import { StatusFilter } from './status-filter.component';

export default {
  title: 'Sidebar Components/Status Filter',
  argTypes: { onSubmit: { action: 'Change Status' } },
};

const Template = args => <StatusFilter {...args} />;

export const Default = Template.bind({});

export const SelectedStatus = Template.bind({});
SelectedStatus.args = {
  status: 'COMPLETE',
};
