import React from 'react';
import UpdateUserForm from './update-user-form.component';

export default {
  title: 'Accounts/UpdateUserForm',
  component: UpdateUserForm,
  argTypes: {
    updateUser: { action: true },
  },
};

const Template = args => <UpdateUserForm {...args} />;

export const NoUser = Template.bind({});

export const User = Template.bind({});
User.args = { user: { name: 'Test User', email: 'user@test.com' } };
