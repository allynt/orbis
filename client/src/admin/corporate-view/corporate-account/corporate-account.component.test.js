import React from 'react';

import { cleanup, render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import CorporateAccount from './corporate-account.component';

const renderComponent = (customer, updateCustomer) =>
  render(
    <CorporateAccount customer={customer} updateCustomer={updateCustomer} />,
  );

describe('Update User Form Component', () => {
  let updateCustomer = null;
  let customer = null;

  beforeEach(() => {
    updateCustomer = jest.fn();
    customer = {
      name: 'cyberdyne',
      official_name: 'Cyberdyne Systems',
      country: 'United States',
      address: '123 America Street',
      postcode: 'PH7 U16',
      logo: 'Test URL',
    };
  });

  afterEach(cleanup);

  it('should render the Corporate Account Form, pre-populated with the customer`s information if it exists', () => {
    const { getByAltText, getByDisplayValue } = renderComponent(
      customer,
      updateCustomer,
    );

    expect(getByAltText('cyberdyne Logo')).toBeInTheDocument();

    expect(getByDisplayValue(customer.name)).toBeInTheDocument();
    expect(getByDisplayValue(customer.country)).toBeInTheDocument();
    expect(getByDisplayValue(customer.address)).toBeInTheDocument();
    expect(getByDisplayValue(customer.postcode)).toBeInTheDocument();
  });

  it('should dispatch new values when `Update Changes` button is clicked', () => {
    const { getByRole, getByDisplayValue } = renderComponent(
      customer,
      updateCustomer,
    );

    const newCustomer = {
      ...customer,
      name: 'Reynolm Industries',
    };

    const nameField = getByDisplayValue(customer.name);
    const button = getByRole('button', { name: 'Update Changes' });

    userEvent.clear(nameField);
    userEvent.type(nameField, 'Reynolm Industries');
    userEvent.click(button);

    waitFor(() => expect(updateCustomer).toHaveBeenCalledWith(newCustomer));
  });

  it('should disable `Update Changes` button unless changes have been made', () => {
    const { getByRole, getByDisplayValue } = renderComponent(
      customer,
      updateCustomer,
    );

    const nameField = getByDisplayValue(customer.name);
    const button = getByRole('button', { name: 'Update Changes' });

    expect(button).toHaveAttribute('disabled');
    userEvent.type(nameField, 'aaa');
    expect(button).not.toHaveAttribute('disabled');
  });
});
