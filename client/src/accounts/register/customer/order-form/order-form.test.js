import React from 'react';
import { render } from '@testing-library/react';
import OrderForm from './order-form.component';
import userEvent from '@testing-library/user-event';

const SUBSCRIPTION = /selected\slicence\ssubscription/i;
const PAYMENT_TYPE = /payment\stype/i;
const AMOUNT = /amount\sto\sbe\spayed/i;
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
    userEvent.click(getByRole('checkbox', { name: CONFIRMATION }));
    expect(getByRole('button', { name: SUBMIT })).not.toBeDisabled();
  });

  it('calls onSubmit with the form values when the form is submitted', () => {
    const values = {
      type: 'free',
      subscriptions: {
        orb: 'core',
        n_licences: 10,
        expiration: '2021-04-01T00:00:00+0000',
      },
    };
    const { getByRole, onSubmit } = renderComponent();
    userEvent.click(getByRole('checkbox', { name: CONFIRMATION }));
    userEvent.click(getByRole('button', { name: SUBMIT }));
    expect(onSubmit).toHaveBeenCalledWith(values);
  });
});
