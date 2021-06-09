import React from 'react';

import { DateRangeFilter } from './date-range-filter.component';

export default {
  title: 'Sidebar Components/Date Range Filter',
  argTypes: { onSubmit: { action: true } },
};

const Template = args => <DateRangeFilter {...args} />;

export const Test = Template.bind({});
