import React from 'react';
import { DateRangeFilter } from './date-range-filter.component';

export default {
  title: 'DateRangeFilter',
  argTypes: { onSubmit: { action: true } },
};

const Template = args => <DateRangeFilter {...args} />;

export const Test = Template.bind({});
