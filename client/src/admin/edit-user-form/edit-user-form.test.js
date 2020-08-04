// It submits a full user Object when save button is clicked

// It closes the dialog when save button is clicked

import React from 'react';
import { render } from '@testing-library/react';

import { customer } from '../test-story-data';

import { EditUserForm } from './edit-user-form.component';

import userEvent from '@testing-library/user-event';

describe('EditUserForm', () => {
  const user = {};
  const availableLicences = [];
  const oneAdminRemaining = true;
  const editUser = jest.fn();
  const close = jest.fn();

  it('renders an edit form populated by current user information', () => {
    const { getByText } = render(
      <EditUserForm
        user={user}
        customer={customer}
        availableLicences={availableLicences}
        oneAdminRemaining={oneAdminRemaining}
        editUser={editUser}
        close={close}
      />,
    );
  });

  it('displays and checks by default the user`s current licences', () => {});

  it('shows only 1 of each type of available licence that the user does not already have', () => {});

  it('retrieves and adds only the checked licence box IDs for dispatching', () => {});

  it('disables the `Save Changes` button when no changes have been made', () => {});

  it('displays error message if `Name` field is empty', () => {});

  it('Submits a full user object when `Save Changes` button is clicked', () => {});

  it('closes the dialog when the `Save Changes` button is clicked', () => {});
});
