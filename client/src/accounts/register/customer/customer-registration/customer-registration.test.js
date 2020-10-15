import React from 'react';
import { render, waitFor } from '@testing-library/react';
import CustomerRegistration from './customer-registration.component';
import userEvent from '@testing-library/user-event';

const EMAIL = /work\semail\saddress/i;
const NAME = /organisation\sname/i;
const OFFICIAL_NAME = /organisation\sofficial\sname/i;
const TYPE = /type\sof\sorganisation/i;
const REGISTERED_NUMBER = /registered\snumber/i;
const LICENCE = /^licence$/i;
const NUMBER_OF_LICENCES = /number\sof\slicences/i;
const FREE_TRIAL_PERIOD = /free\strial\ssubscription\speriod\sends/i;
const SUBMIT = /next/i;

const renderComponent = ({ email = 'test@test.com' } = {}) => {
  const onSubmit = jest.fn();
  const utils = render(
    <CustomerRegistration email={email} onSubmit={onSubmit} />,
  );
  return { ...utils, onSubmit, email };
};

describe('<CustomerRegistration />', () => {
  it('displays the customer registration form', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('textbox', { name: EMAIL })).toBeInTheDocument();
    expect(getByRole('textbox', { name: NAME })).toBeInTheDocument();
    expect(getByRole('textbox', { name: OFFICIAL_NAME })).toBeInTheDocument();
    expect(getByRole('textbox', { name: TYPE })).toBeInTheDocument();
    expect(
      getByRole('textbox', { name: REGISTERED_NUMBER }),
    ).toBeInTheDocument();
    expect(getByRole('textbox', { name: LICENCE })).toBeInTheDocument();
    expect(
      getByRole('textbox', { name: NUMBER_OF_LICENCES }),
    ).toBeInTheDocument();
    expect(
      getByRole('textbox', { name: FREE_TRIAL_PERIOD }),
    ).toBeInTheDocument();
  });

  it('pre-populates the email field with the supplied email address', () => {
    const { email, getByRole } = renderComponent();
    expect(getByRole('textbox', { name: EMAIL })).toHaveValue(email);
  });

  it('has the email field as readonly', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('textbox', { name: EMAIL })).toHaveAttribute('readonly');
  });

  it('disables the submit button while the form is clean', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: SUBMIT })).toBeDisabled();
  });

  it('enables the submit button when the form is dirty', async () => {
    const { getByRole } = renderComponent();
    userEvent.type(getByRole('textbox', { name: NAME }), 'testname');
    await waitFor(() =>
      expect(getByRole('button', { name: SUBMIT })).not.toBeDisabled(),
    );
  });

  it('disables the submit button when there is form errors', async () => {
    const { getByRole } = renderComponent();
    const submitButton = getByRole('button', { name: SUBMIT });
    userEvent.type(getByRole('textbox', { name: OFFICIAL_NAME }), 'wrong');
    userEvent.click(submitButton);
    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it('calls the onSubmit function with the form values', async () => {
    const values = {
      email: 'test@test.com',
      customerName: 'Test Name',
      customerNameOfficial: 'Money launderers Ltd.',
      customerType: 'GOV_AND_EXEC_AGENCIES',
      registeredNumber: '1234',
      licence: 'ORBIS Core',
      numberOfLicences: 10,
      subscriptionPeriod: '2021-03-31T23:00:00.000Z',
    };
    const { getByRole, getByText, onSubmit } = renderComponent();
    userEvent.type(getByRole('textbox', { name: NAME }), values.customerName);
    userEvent.type(
      getByRole('textbox', { name: OFFICIAL_NAME }),
      values.customerNameOfficial,
    );
    userEvent.click(getByRole('textbox', { name: TYPE }));
    userEvent.click(getByText('Government & Executive Agencies'));
    userEvent.type(
      getByRole('textbox', { name: REGISTERED_NUMBER }),
      values.registeredNumber,
    );
    userEvent.click(getByRole('button', { name: SUBMIT }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(values));
  });
});
