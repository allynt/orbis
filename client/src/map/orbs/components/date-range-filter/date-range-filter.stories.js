import React from 'react';

import { DateRangeFilter } from './date-range-filter.component';

const Index = {
  title: 'Sidebar Components/Date Range Filter',
  argTypes: { onSubmit: { action: true } },
};

export default Index;

const Template = args => <DateRangeFilter {...args} />;

export const Test = Template.bind({});
