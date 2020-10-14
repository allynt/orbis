import React from 'react';

import { cleanup, render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import CorporateAccount from './corporate-account.component';

const renderComponent = (customer, updateCustomer) =>
  render(
    <CorporateAccount customer={customer} updateCustomer={updateCustomer} />,
  );

describe('Update User Form Component', () => {
<<<<<<< HEAD
  let title = 'Corporate Account';
  let customer = {
    type: 'MULTIPLE',
    name: 'cyberdyne',
    logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
    users: [
      {
        id: 2,
        customers: [
          {
            name: 'cyberdyne',
            manager: true,
          },
        ],
        username: 'admin@test.com',
        email: 'admin@test.com',
        name: 'Harry Callahan',
        avatar:
          'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
        description: '',
        is_verified: true,
        is_approved: true,
        profiles: {},
        roles: ['AdminRole', 'UserRole'],
      },
    ],
    data_limit: 100,
    data_total: 50,
  };
=======
  let updateCustomer = null;
  let customer = null;

  beforeEach(() => {
    updateCustomer = jest.fn();
    customer = {
      name: 'cyberdyne',
      title: 'Cyberdyne Systems',
      country: 'United States',
      address: '123 America Street',
      postcode: 'PH7 U16',
      logo: 'Test URL',
    };
  });
>>>>>>> fix(frontend): Add new form, logic, dispatches and tests

  afterEach(cleanup);

  it('should render the Corporate Account Form, pre-populated with the customer`s information if it exists', () => {
    const { container, getByAltText, getByDisplayValue } = renderComponent(
      customer,
      updateCustomer,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByAltText('Organisation Logo')).toBeInTheDocument();

    expect(getByDisplayValue(customer.name)).toBeInTheDocument();
    expect(getByDisplayValue(customer.country)).toBeInTheDocument();
    expect(getByDisplayValue(customer.address)).toBeInTheDocument();
    expect(getByDisplayValue(customer.postcode)).toBeInTheDocument();
  });

  it('should dispatch new values when `Update Changes` button is clicked', () => {
    const { getByText, getByDisplayValue } = renderComponent(
      customer,
      updateCustomer,
    );

    const newCustomer = {
      ...customer,
      name: 'Reynolm Industries',
    };

    const nameField = getByDisplayValue(customer.name);

    userEvent.clear(nameField);
    userEvent.type(nameField, 'Reynolm Industries');
    userEvent.click(getByText('Update Changes'));

    waitFor(() => expect(updateCustomer).toHaveBeenCalledWith(newCustomer));
  });

  it('should disable `Update Changes` button unless no changes have been made', () => {
    const { getByText, getByDisplayValue } = renderComponent(
      customer,
      updateCustomer,
    );

    const nameField = getByDisplayValue(customer.name);

    expect(getByText('Update Changes')).toHaveAttribute('disabled');
    userEvent.type(nameField, 'aaa');
    expect(getByText('Update Changes')).not.toHaveAttribute('disabled');
  });
});
