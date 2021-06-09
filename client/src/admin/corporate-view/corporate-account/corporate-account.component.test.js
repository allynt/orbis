import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CorporateAccount from './corporate-account.component';

const renderComponent = () => {
  const updateCustomer = jest.fn();
  const customer = {
    name: 'cyberdyne',
    official_name: 'Cyberdyne Systems',
    country: 'United States',
    address: '123 America Street',
    postcode: 'PH7 U16',
    logo: 'Test URL',
  };
  const utils = render(
    <CorporateAccount customer={customer} updateCustomer={updateCustomer} />,
  );
  return { customer, updateCustomer, ...utils };
};

describe('Update User Form Component', () => {
  it('should render the Corporate Account Form, pre-populated with the customer`s information if it exists', () => {
    const { customer, getByAltText, getByDisplayValue } = renderComponent();

    expect(getByAltText('cyberdyne Logo')).toBeInTheDocument();

    expect(getByDisplayValue(customer.name)).toBeInTheDocument();
    expect(getByDisplayValue(customer.country)).toBeInTheDocument();
    expect(getByDisplayValue(customer.address)).toBeInTheDocument();
    expect(getByDisplayValue(customer.postcode)).toBeInTheDocument();
  });

  it('should dispatch new values when `Update Changes` button is clicked', async () => {
    const { customer, updateCustomer, getByRole } = renderComponent();

    const newCustomer = {
      ...customer,
      name: 'Reynolm Industries',
    };

    const nameField = getByRole('textbox', { name: /name/i });

    userEvent.clear(nameField);
    userEvent.type(nameField, 'Reynolm Industries');
    userEvent.click(getByRole('button', { name: 'Update Changes' }));

    await waitFor(() =>
      expect(updateCustomer).toHaveBeenCalledWith(newCustomer),
    );
  });

  it('should disable `Update Changes` button unless changes have been made', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button', { name: 'Update Changes' })).toBeDisabled();
    userEvent.type(getByRole('textbox', { name: /name/i }), 'aaa');
    expect(getByRole('button', { name: 'Update Changes' })).not.toBeDisabled();
  });
});
