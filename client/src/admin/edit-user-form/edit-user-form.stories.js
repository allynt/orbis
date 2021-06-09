import * as React from 'react';

import { EditUserForm } from './edit-user-form.component';

export default {
  title: 'Admin/Edit User Form',
  argTypes: { editUser: { action: 'editUser' }, close: { action: 'close' } },
};

const Template = args => <EditUserForm {...args} />;

export const Default = Template.bind({});

export const WithUser = Template.bind({});
WithUser.args = {
  user: {
    id: 1,
    type: 'MANAGER',
    licences: ['1'],
    user: {
      name: 'Test User',
      email: 'test@test.com',
    },
  },
};

export const WithUserAndLicences = Template.bind({});
WithUserAndLicences.args = {
  ...WithUser.args,
  customer: {
    licences: [
      { id: '1', orb: 'Forestry', customer_user: 1 },
      { id: '2', orb: 'Health', customer_user: null },
    ],
  },
  availableLicences: [{ id: '2', orb: 'Health' }],
};

export const OneAdminRemaining = Template.bind({});
OneAdminRemaining.args = {
  ...WithUserAndLicences.args,
  oneAdminRemaining: true,
};
