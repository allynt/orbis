import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OrderForm from './order-form.component';

const SUBSCRIPTION = /selected\slicence\ssubscription/i;
const PAYMENT_TYPE = /payment\stype/i;
const AMOUNT = /amount\sto\sbe\spaid/i;
const NUMBER_OF_LICENCES = /number\sof\slicences/i;
const PERIOD = /subscription\speriod\sends/i;
const CONFIRMATION = /i\sconfirm\sthe\sinformation\sabove\sis\scorrect/i;
const SUBMIT = /confirm/i;

const renderComponent = () => {
  const onSubmit = jest.fn();
  const utils = render(<OrderForm onSubmit={onSubmit} />);
  return { ...utils, onSubmit };
};

describe('<OrderForm />', () => {
  it('shows the order form', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('textbox', { name: SUBSCRIPTION })).toBeInTheDocument();
    expect(getByRole('textbox', { name: PAYMENT_TYPE })).toBeInTheDocument();
    expect(getByRole('textbox', { name: AMOUNT })).toBeInTheDocument();
    expect(
      getByRole('textbox', { name: NUMBER_OF_LICENCES }),
    ).toBeInTheDocument();
    expect(getByRole('textbox', { name: PERIOD })).toBeInTheDocument();
  });

  it('has the submit button disabled by default', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: SUBMIT })).toBeDisabled();
  });

  it('enables the submit button once the order is agreed', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: SUBMIT })).toBeDisabled();
    userEvent.click(getByRole('checkbox', { name: CONFIRMATION }));
    expect(getByRole('button', { name: SUBMIT })).toBeEnabled();
  });

  it('calls onSubmit with the form values when the form is submitted', async () => {
    const values = {
      paymentType: 'Free Trial',
      subscription: 'ORBIS Core Datasets',
      licences: 10,
      period: '2021-04-30T00:00:00.000Z',
      confirm: true,
      amount: 0,
    };
    const { getByRole, onSubmit } = renderComponent();
    userEvent.click(getByRole('checkbox', { name: CONFIRMATION }));
    userEvent.click(getByRole('button', { name: SUBMIT }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(values));
  });
});
