import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Form } from './form.component';

describe('Form', () => {
  it('Calls onSubmit with the form values', async () => {
    const official_name = 'Silly test org',
      registered_id = '123456789',
      vat_number = '987654321',
      address = '123 Silly street, Faketon, Biscuitshire';
    const onSubmit = jest.fn();
    const { getByRole } = render(<Form onSubmit={onSubmit} />);
    userEvent.type(
      getByRole('textbox', { name: /organisation name/i }),
      official_name,
    );
    userEvent.click(getByRole('button', { name: /type of organisation/i }));
    userEvent.click(getByRole('option', { name: /charity/i }));
    userEvent.type(
      getByRole('textbox', { name: /registered number/i }),
      registered_id,
    );
    userEvent.type(getByRole('textbox', { name: /vat number/i }), vat_number);
    userEvent.type(getByRole('textbox', { name: /billing address/i }), address);
    userEvent.click(getByRole('button', { name: /save/i }));
    await waitFor(() =>
      expect(onSubmit).toBeCalledWith({
        official_name,
        company_type: 'CHARITY',
        registered_id,
        vat_number,
        address,
      }),
    );
  });

  it('Shows default values', () => {
    const customer = {
      address: '123 Test Street',
      official_name: 'Test Org',
      registered_id: '123456789',
      company_type: 'CHARITY',
    };
    const { getByRole } = render(<Form customer={customer} />);
    expect(getByRole('textbox', { name: /organisation name/i })).toHaveValue(
      customer.official_name,
    );
    expect(
      getByRole('button', { name: /type of organisation/i }),
    ).toHaveTextContent('Charity');
    expect(getByRole('textbox', { name: /registered number/i })).toHaveValue(
      customer.registered_id,
    );
    expect(getByRole('textbox', { name: /billing address/i })).toHaveValue(
      customer.address,
    );
  });

  it('Only enables the submit button if dirty', () => {
    const { getByRole } = render(<Form />);
    expect(getByRole('button', { name: /save/i })).toBeDisabled();
    userEvent.type(
      getByRole('textbox', { name: /organisation name/i }),
      'Test org',
    );
    expect(getByRole('button', { name: /save/i })).not.toBeDisabled();
  });
});
