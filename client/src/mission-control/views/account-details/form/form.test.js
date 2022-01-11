import React from 'react';

import { render, waitFor, screen, userEvent } from 'test/test-utils';

import { Form } from './form.component';

describe('Form', () => {
  it('Calls onSubmit with the form values', async () => {
    const name = 'Silly test org',
      registered_id = '123456789',
      vat_number = '987654321',
      address = '123 Silly street, Faketon, Biscuitshire';
    const onSubmit = jest.fn();

    render(<Form onSubmit={onSubmit} />);

    userEvent.type(
      screen.getByRole('textbox', { name: /organisation name/i }),
      name,
    );
    expect(
      screen.getByRole('textbox', { name: /organisation name/i }),
    ).toHaveValue(name);
    userEvent.click(
      screen.getByRole('button', { name: /type of organisation/i }),
    );
    userEvent.click(screen.getByRole('option', { name: /charity/i }));
    userEvent.type(
      screen.getByRole('textbox', { name: /registered number/i }),
      registered_id,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /vat number/i }),
      vat_number,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /billing address/i }),
      address,
    );

    userEvent.click(screen.getByRole('button', { name: /save/i }), undefined, {
      skipPointerEventsCheck: true,
    });

    await waitFor(() =>
      expect(onSubmit).toBeCalledWith({
        name: name,
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
      name: 'Test Org',
      registered_id: '123456789',
      company_type: 'CHARITY',
    };

    render(<Form customer={customer} />);
    screen.debug();

    expect(
      screen.getByRole('textbox', { name: /organisation name/i }),
    ).toHaveValue(customer.name);
    expect(
      screen.getByRole('button', { name: /type of organisation/i }),
    ).toHaveTextContent('Charity');
    expect(
      screen.getByRole('textbox', { name: /registered number/i }),
    ).toHaveValue(customer.registered_id);
    expect(
      screen.getByRole('textbox', { name: /billing address/i }),
    ).toHaveValue(customer.address);
  });

  it('Only enables the submit button if dirty', () => {
    render(<Form />);

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();

    userEvent.type(
      screen.getByRole('textbox', { name: /organisation name/i }),
      'Test org',
    );

    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
  });
});
