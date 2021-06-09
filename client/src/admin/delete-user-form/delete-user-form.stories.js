import React from 'react';

import { action } from '@storybook/addon-actions';

import { DeleteUserForm } from './delete-user-form.component';

const user = { id: 123, user: { name: 'John Smith' } };

export default {
  title: 'Admin/Delete User Form',
  component: DeleteUserForm,
};

export const Default = () => (
  <DeleteUserForm
    user={user}
    deleteUser={action('Delete Customer Invitation')}
    close={action('Close')}
  />
);
