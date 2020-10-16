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
      title: 'Cyberdyne Systems',
      country: 'United States',
      address: '123 America Street',
      postcode: 'PH7 U16',
      logo: 'Test URL',
    };
  });

  afterEach(cleanup);

  it('should render the Corporate Account Form, pre-populated with the customer`s information if it exists', () => {
    const { container, getByAltText, getByDisplayValue } = renderComponent(
      customer,
      updateCustomer,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByAltText('Cyberdyne Systems Logo')).toBeInTheDocument();

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
