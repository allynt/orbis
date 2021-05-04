import React from 'react';

import { DropdownFilter } from './dropdown-filter.component';

import { options } from './dropdown-filter.test';

export default {
  title: 'Sidebar Components/Dropdown Filter',
  argTypes: { onSubmit: { action: 'Change Value' } },
};

const Template = args => (
  <DropdownFilter options={options} label="Test Label" {...args} />
);

export const Default = Template.bind({});

export const ExistingValue = Template.bind({});
ExistingValue.args = {
  value: 'Existing Value',
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue: 'Default Value',
};
