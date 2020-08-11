import React from 'react';

import { render } from '@testing-library/react';

import { customer } from '../test-story-data';

import { EditUserForm } from './edit-user-form.component';

import userEvent from '@testing-library/user-event';

describe('EditUserForm', () => {
  const user = {
    id: '2',
    licences: ['2', '5'],
    type: 'MANAGER',
    user: { name: 'John Smith', email: 'jsmith@test.com' },
  };

  const availableLicences = [
    { id: '9', orb: 'Steel', customer_user: null },
    { id: '10', orb: 'Timber', customer_user: null },
    { id: '11', orb: 'Steel', customer_user: null },
    { id: '12', orb: 'Timber', customer_user: null },
  ];

  const userCheckboxes = [
    { id: '2', orb: 'Rice', customer_user: '2' },
    { id: '5', orb: 'Oil', customer_user: '2' },
    { id: '9', orb: 'Steel', customer_user: null },
    { id: '10', orb: 'Timber', customer_user: null },
  ];

  const oneAdminRemaining = true;
  const editUser = jest.fn();
  const close = jest.fn();

  const renderComponent = () =>
    render(
      <EditUserForm
        user={user}
        customer={customer}
        availableLicences={availableLicences}
        oneAdminRemaining={oneAdminRemaining}
        editUser={editUser}
        close={close}
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
    const { getByLabelText } = renderComponent();

    userCheckboxes.forEach(ul => {
      if (ul.customer_user) {
        expect(getByLabelText(ul.orb)).toBeInTheDocument();
        expect(getByLabelText(ul.orb)).toBeChecked();
      }
    });
  });

  it('displays and unchecks by default the available licence options', () => {
    const { getByLabelText } = renderComponent();

    userCheckboxes.forEach(ul => {
      if (!ul.customer_user) {
        expect(getByLabelText(ul.orb)).toBeInTheDocument();
        expect(getByLabelText(ul.orb)).not.toBeChecked();
      }
    });
  });

  it('displays admin status checkboxes, with user`s current status checked by default', () => {
    const { getByLabelText } = renderComponent();

    expect(getByLabelText('Yes')).toBeInTheDocument();
    expect(getByLabelText('No')).toBeInTheDocument();
    expect(getByLabelText('Yes')).toBeChecked();
  });

  it('shows only 1 of each type of available licence that the user does not already have', () => {
    const { getAllByRole, getAllByText } = renderComponent();

    availableLicences.forEach(al => {
      expect(getAllByText(al.orb).length).toEqual(1);
    });

    expect(getAllByRole('checkbox').length).toEqual(userCheckboxes.length);
  });

  it('prioritises licences with the user`s ID over available licences with null `customer_user` value', () => {
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

    const { getByText, getByDisplayValue } = render(
      <EditUserForm
        user={user}
        customer={testCustomer}
        availableLicences={availableLicences}
        editUser={editUser}
        close={close}
      />,
    );

    const nameField = getByDisplayValue(user.user.name);

    userEvent.clear(nameField);
    userEvent.type(nameField, 'Steve Brown');
    userEvent.click(getByText('Save Changes'));

    expect(editUser).toHaveBeenCalledWith(newUser);
  });

  it('takes first available licence of selected type with null `customer_user` value, if none exist with user`s ID', () => {
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

    const { getByText, getByLabelText } = render(
      <EditUserForm
        user={user}
        customer={testCustomer}
        availableLicences={availableLicences}
        editUser={editUser}
        close={close}
      />,
    );

    userEvent.click(getByLabelText('Steel'));
    userEvent.click(getByText('Save Changes'));

    expect(editUser).toHaveBeenCalledWith(newUser);
  });

  it('submits a full user object when `Save Changes` button is clicked', () => {
    const { getByText, getByDisplayValue } = renderComponent();

    const newUser = {
      ...user,
      user: {
        ...user.user,
        name: 'Jerry Thomson',
      },
    };

    const nameField = getByDisplayValue(user.user.name);

    userEvent.clear(nameField);
    userEvent.type(nameField, 'Jerry Thomson');
    userEvent.click(getByText('Save Changes'));

    expect(editUser).toHaveBeenCalledWith(newUser);
  });

  it('retrieves and adds only the checked licence box IDs for dispatching', () => {
    const { getByText, getByLabelText } = renderComponent();

    const userWithAddedLicence = {
      ...user,
      licences: ['2', '5', '9'],
    };

    expect(user.licences).toEqual(['2', '5']);

    userEvent.click(getByLabelText('Steel'));
    userEvent.click(getByText('Save Changes'));

    expect(editUser).toHaveBeenCalledWith(userWithAddedLicence);
  });

  it('disables the `Save Changes` button only when no changes have been made', () => {
    const { getByText, getByLabelText } = renderComponent();

    expect(getByText('Save Changes')).toHaveAttribute('disabled');
    userEvent.click(getByLabelText('Steel'));
    expect(getByText('Save Changes')).not.toHaveAttribute('disabled');
  });

  it('disables the `No` button (admin status) when only one admin remains', () => {
    const { getByLabelText } = renderComponent();

    expect(getByLabelText('No')).toHaveAttribute('disabled');
  });

  it('displays error message if `Name` field is empty', () => {
    const { getByText, getByDisplayValue } = renderComponent();

    userEvent.clear(getByDisplayValue(user.user.name));

    userEvent.click(getByText('Save Changes'));

    expect(getByText('Name is required')).toBeInTheDocument();
    expect(getByText('Save Changes')).toHaveAttribute('disabled');

    // expect(close).not.toHaveBeenCalled();
  });

  it('closes the dialog when the `Save Changes` button is clicked', () => {
    const { getByText, getByLabelText } = renderComponent();

    userEvent.click(getByLabelText('Steel'));
    userEvent.click(getByText('Save Changes'));

    expect(close).toHaveBeenCalled();
  });
});
