import * as React from 'react';
import { PieChart } from './pie.component';

export default { title: 'Components/Charts/Pie' };

const Template = args => <PieChart {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  data: [
    { value: 20, name: 'Test 1' },
    { value: 30, name: 'Test 2' },
  ],
};

export const LotsOfValues = Template.bind({});
LotsOfValues.args = {
  data: Array(40)
    .fill(undefined)
    .map((_, i) => ({ value: i * 10, name: `Item ${i}` })),
};
