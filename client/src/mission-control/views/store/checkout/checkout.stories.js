import React from 'react';

import { Checkout } from './checkout.component';

export default { title: 'Mission Control/Store/Checkout' };

const Template = args => <Checkout {...args} />;

export const Default = Template.bind({});
Default.args = {
  orbs: [
    {
      id: 1,
      name: 'Test Orb',
      licence_cost: 0,
      terms_document: 'http://google.com',
    },
  ],
  location: { search: '?orbId=1&users=10' },
};
