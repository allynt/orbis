import React from 'react';
import { render, waitFor } from '@testing-library/react';
import OrderForm from './order-form.component';
import userEvent from '@testing-library/user-event';

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
    const submitButton = getByRole('button', { name: SUBMIT });
    expect(submitButton).toBeDisabled();
    userEvent.click(getByRole('checkbox', { name: CONFIRMATION }));
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onSubmit with the form values when the form is submitted', async () => {
    const values = {
      paymentType: 'free',
      subscription: 'core',
      licences: 10,
      period: '2021-04-01T00:00:00.000Z',
      confirm: true,
      amount: 0,
    };
    const { getByRole, onSubmit } = renderComponent();
    userEvent.click(getByRole('checkbox', { name: CONFIRMATION }));
    userEvent.click(getByRole('button', { name: SUBMIT }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(values));
  });
});
