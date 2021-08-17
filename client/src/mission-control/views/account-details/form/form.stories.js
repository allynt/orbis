import React from 'react';

import { Form } from './form.component';

export default {
  title: 'Mission Control/Account Details/Form',
  argTypes: { onSubmit: { action: true } },
};

const Template = args => <Form {...args} />;

export const Default = Template.bind({});
Default.args = {};
