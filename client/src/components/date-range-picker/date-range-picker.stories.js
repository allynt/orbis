import React from 'react';
import { DateRangePicker } from './date-range-picker.component';

export default {
  title: 'Components/Date Range Picker',
  argTypes: {
    onApply: { action: true },
  },
};

const Template = args => <DateRangePicker {...args} />;

export const Default = Template.bind({});
