import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customer } from 'mission-control/views/users-view/test-story-data';

import { EditUserForm } from './edit-user-form.component';

describe('EditUserForm', () => {
  let user = null;
  let availableLicences = null;
  let userCheckboxes = null;
  let oneAdminRemaining = null;
  let editUser = null;

  beforeEach(() => {
    user = {
      id: '2',
      licences: ['2', '5'],
      type: 'MANAGER',
      user: { name: 'John Smith', email: 'jsmith@test.com' },
    };

    availableLicences = [
      { id: '9', orb: 'Steel', customer_user: null },
      { id: '10', orb: 'Timber', customer_user: null },
      { id: '11', orb: 'Steel', customer_user: null },
      { id: '12', orb: 'Timber', customer_user: null },
    ];

    userCheckboxes = [
      { id: '2', orb: 'Rice', customer_user: '2' },
      { id: '5', orb: 'Oil', customer_user: '2' },
      { id: '9', orb: 'Steel', customer_user: null },
      { id: '10', orb: 'Timber', customer_user: null },
    ];

    oneAdminRemaining = true;
    editUser = jest.fn();
  });

  const renderComponent = () =>
    render(
      <EditUserForm
        user={user}
        customer={customer}
        availableLicences={availableLicences}
        oneAdminRemaining={oneAdminRemaining}
        editUser={editUser}
      />,
    );

  it('renders an edit form populated by current user information', () => {
    const { getByText, getByDisplayValue } = renderComponent();

    expect(getByDisplayValue(user.user.name)).toBeInTheDocument();
    expect(getByDisplayValue(user.user.email)).toBeInTheDocument();

    expect(getByText('Project Access')).toBeInTheDocument();
    expect(getByText('Admin Rights')).toBeInTheDocument();
  });

  it('displays and checks by default the user`s current licences', () => {
    const { getByRole } = renderComponent();

    userCheckboxes.forEach(ul => {
      if (ul.customer_user) {
        const element = getByRole('checkbox', { name: ul.orb });
        expect(element).toBeInTheDocument();
        expect(element).toBeChecked();
      }
    });
  });

  it('displays and unchecks by default the available licence options', () => {
    const { getByRole } = renderComponent();

    userCheckboxes.forEach(ul => {
      if (!ul.customer_user) {
        const element = getByRole('checkbox', { name: ul.orb });
        expect(element).toBeInTheDocument();
        expect(element).not.toBeChecked();
      }
    });
  });

  it('displays admin status checkboxes, with user`s current status checked by default', () => {
    const { getByRole } = renderComponent();

    const yesElement = getByRole('radio', { name: 'Yes' });
    const noElement = getByRole('radio', { name: 'No' });
    expect(yesElement).toBeInTheDocument();
    expect(noElement).toBeInTheDocument();
    expect(yesElement).toBeChecked();
    expect(noElement).not.toBeChecked();
  });

  it('shows only 1 of each type of available licence that the user does not already have', () => {
    const { getAllByRole } = renderComponent();

    availableLicences.forEach(al =>
      expect(getAllByRole('checkbox', { name: al.orb }).length).toEqual(1),
    );

    expect(getAllByRole('checkbox').length).toEqual(userCheckboxes.length);
  });

  it('prioritises licences with the user`s ID over available licences with null `customer_user` value', async () => {
    const testCustomer = {
      licences: [
        {
          id: '123',
          orb: 'Rice',
          customer_user: null,
        },
        {
          id: '456',
          orb: 'Rice',
          customer_user: '2',
        },
      ],
    };

    const newUser = {
      ...user,
      licences: ['456'],
      user: {
        ...user.user,
        name: 'Steve Brown',
      },
    };

    const { getByRole } = render(
      <EditUserForm
        user={user}
        customer={testCustomer}
        availableLicences={availableLicences}
        editUser={editUser}
      />,
    );

    const nameField = getByRole('textbox', { name: 'Name' });

    userEvent.clear(nameField);
    userEvent.type(nameField, 'Steve Brown');
    userEvent.click(getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(editUser).toHaveBeenCalledWith(newUser));
  });

  it('takes first available licence of selected type with null `customer_user` value, if none exist with user`s ID', async () => {
    const testCustomer = {
      licences: [
        {
          id: '123',
          orb: 'Steel',
          customer_user: '99',
        },
        {
          id: '456',
          orb: 'Steel',
          customer_user: null,
        },
      ],
    };

    const newUser = {
      ...user,
      licences: ['456'],
    };

    const { getByRole, getByText } = render(
      <EditUserForm
        user={user}
        customer={testCustomer}
        availableLicences={availableLicences}
        editUser={editUser}
      />,
    );

    userEvent.click(getByRole('checkbox', { name: 'Steel' }));
    userEvent.click(getByText('Save Changes'));

    await waitFor(() => expect(editUser).toHaveBeenCalledWith(newUser));
  });

  it('submits a full user object when `Save Changes` button is clicked', async () => {
    const { getByRole } = renderComponent();

    const newUser = {
      ...user,
      user: {
        ...user.user,
        name: 'Jerry Thomson',
      },
    };

    const nameField = getByRole('textbox', { name: 'Name' });

    userEvent.clear(nameField);
    userEvent.type(nameField, 'Jerry Thomson');
    userEvent.click(getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(editUser).toHaveBeenCalledWith(newUser));
  });

  it('retrieves and adds only the checked licence box IDs for dispatching', async () => {
    const { getByRole, getByText, getByLabelText } = renderComponent();

    const userWithAddedLicence = {
      ...user,
      licences: ['2', '5', '9'],
    };

    userEvent.click(getByLabelText('Steel'));
    userEvent.click(getByText('Save Changes'), undefined, {
      skipPointerEventsCheck: true,
    });

    userEvent.click(getByRole('button', { name: 'Save Changes' }), undefined, {
      skipPointerEventsCheck: true,
    });

    await waitFor(() =>
      expect(editUser).toHaveBeenCalledWith(userWithAddedLicence),
    );
  });

  it('disables the `Save Changes` button when no changes have been made', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: 'Save Changes' })).toBeDisabled();
  });

  it('enables the `Save Changes` button when changes have been made', () => {
    const { getByRole } = renderComponent();

    userEvent.click(getByRole('checkbox', { name: 'Steel' }));
    expect(getByRole('button', { name: 'Save Changes' })).toBeEnabled();
  });

  it('re-disables the `Save Changes` button if changes are reverted', () => {
    const { getByRole } = renderComponent();

    userEvent.click(getByRole('checkbox', { name: 'Steel' }));
    expect(getByRole('button', { name: 'Save Changes' })).toBeEnabled();
    userEvent.click(getByRole('checkbox', { name: 'Steel' }));
    expect(getByRole('button', { name: 'Save Changes' })).toBeDisabled();
  });

  it('disables the `No` button (admin status) when only one admin remains', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('radio', { name: 'No' })).toBeDisabled();
  });
});
