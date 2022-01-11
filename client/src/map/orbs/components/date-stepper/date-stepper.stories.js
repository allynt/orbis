import React from 'react';

import { DateStepper } from './date-stepper.component';

const Index = {
  title: 'Sidebar Components/Date Stepper',
  argType: { onChange: { action: true } },
};

export default Index;

const Template = args => <DateStepper {...args} />;

export const Default = Template.bind();
Default.args = {
  defaultValue: new Date(2020, 0).getTime(),
  dates: [
    { value: new Date(2020, 0).getTime(), label: '1/2020' },
    { value: new Date(2020, 1).getTime(), label: '2/2020' },
    { value: new Date(2020, 2).getTime(), label: '3/2020' },
  ],
  min: new Date(2020, 0).getTime(),
  max: new Date(2020, 11).getTime(),
};
