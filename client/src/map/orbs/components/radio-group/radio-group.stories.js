import React from 'react';

import { RadioGroup } from './radio-group.component';

export default {
  title: 'Sidebar Components/RadioGroup',
  argTypes: { onChange: { action: true } },
};

const Template = args => <RadioGroup {...args} />;

export const SimpleOptions = Template.bind({});
SimpleOptions.args = {
  options: [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
  ],
};

export const Images = Template.bind({});
Images.args = {
  options: [
    {
      value: 1,
      label: 'One',
      image: '1',
    },
    { value: 2, label: 'Two', image: '2' },
  ],
};

export const Info = Template.bind({});
Info.args = {
  options: [
    {
      value: 1,
      label: 'One',
      info: '1',
    },
    { value: 2, label: 'Two', info: '2' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  ...SimpleOptions.args,
  isLoading: true,
};
