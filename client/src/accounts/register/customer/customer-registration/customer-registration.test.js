import React from 'react';
import { render } from '@testing-library/react';
import CustomerRegistration from './customer-registration.component';
import userEvent from '@testing-library/user-event';

const EMAIL = /work\semail\saddress/i;
const NAME = /organisation\sname/i;
const OFFICIAL_NAME = /organisation\sofficial\sname/i;
const TYPE = /type\sof\sorganisation/i;
const REGISTERED_NUMBER = /registered\snumber/i;
const LICENCE = /licence/i;
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
    expect(getByRole('textbox', { name: EMAIL })).toHaveAttribute(
      'readonly',
      true,
    );
  });

  it('disables the submit button while the form is clean', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: SUBMIT })).toBeDisabled();
  });

  it('enables the submit button when the form is dirty', () => {
    const { getByRole } = renderComponent();
    userEvent.type(getByRole('textbox', { name: NAME }), 'testname');
    expect(getByRole('button', { name: SUBMIT })).not.toBeDisabled();
  });

  it('disables the submit button when there is form errors', () => {
    const { getByRole } = renderComponent();
    const submitButton = getByRole('button', { name: SUBMIT });
    userEvent.type(getByRole('textbox', { name: OFFICIAL_NAME }), 'wrong');
    userEvent.click(submitButton);
    expect(submitButton).toBeDisabled();
  });

  it('calls the onSubmit function with the form values', () => {
    const values = {
      email: 'test@test.com',
      name: 'Test Name',
      official_name: 'Money launderers Ltd.',
      company_type: 'GOV_AND_EXEC_AGENCIES',
      registered_number: '1234',
    };
    const { getByRole, onSubmit } = renderComponent();
    userEvent.type(getByRole('textbox', { name: NAME }), values.name);
    userEvent.type(
      getByRole('textbox', { name: OFFICIAL_NAME }),
      values.official_name,
    );
    userEvent.selectOptions(
      getByRole('textbox', { name: TYPE }),
      values.company_type,
    );
    userEvent.type(
      getByRole('textbox', { name: REGISTERED_NUMBER }),
      values.registered_number,
    );
    userEvent.click(getByRole('button', { name: SUBMIT }));
    expect(onSubmit).toHaveBeenCalledWith(values);
  });
});
