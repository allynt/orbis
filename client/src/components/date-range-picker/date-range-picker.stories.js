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

export const MaxDate = Template.bind({});
MaxDate.args = {
  initialRange: {
    startDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 0, 2),
  },
  maxDate: new Date(2020, 0, 31),
};
