import React from 'react';
import { DateRangeFilter } from './date-range-filter.component';

export default {
  title: 'DateRangeFilter',
  argTypes: { onSubmit: { action: true } },
};

const Template = args => (
  <DateRangeFilter {...args} maxDate={new Date(2077, 9, 24).toISOString()} />
);

export const Test = Template.bind({});
