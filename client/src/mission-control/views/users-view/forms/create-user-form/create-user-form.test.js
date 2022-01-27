import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MESSAGES } from 'utils/validators';

import { CreateUserForm } from './create-user-form.component';

describe('<CreateUserForm />', () => {
  it('Has a name field', () => {
    const { getByRole } = render(<CreateUserForm />);
    expect(getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  });

  it('Has an email field', () => {
    const { getByRole } = render(<CreateUserForm />);
    expect(getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('Has a checkbox for each available licence', () => {
    const licences = {
      Rice: { available: 1 },
      Oil: { available: 1 },
    };
    const { getByRole } = render(
      <CreateUserForm licenceInformation={licences} />,
    );
    Object.keys(licences).forEach(licence =>
      expect(getByRole('checkbox', { name: licence })).toBeInTheDocument(),
    );
  });

  it('Shows a disabled checkbox for a licence which is unavailable', () => {
    const licences = {
      Rice: { available: 1 },
      Oil: { available: 0 },
    };
    const { getByRole } = render(
      <CreateUserForm licenceInformation={licences} />,
    );
    expect(getByRole('checkbox', { name: 'Oil' })).toBeDisabled();
  });

  describe('Shows text if the customer has no licences', () => {
    const cases = [
      ['undefined', undefined],
      ['null', null],
      ['Empty array', []],
    ];
    it.each(cases)('%s', (_, value) => {
      const { getByText } = render(<CreateUserForm licences={value} />);
      expect(getByText('No Licences Available')).toBeInTheDocument();
    });
  });

  it('Has a Create User submit button', () => {
    const { getByRole } = render(<CreateUserForm />);
    const button = getByRole('button', { name: 'Create User' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveProperty('type', 'submit');
  });

  it('Calls the onSubmit function with the form values on successful completion', async () => {
    const licences = {
      Rice: { available: 1 },
      Oil: { available: 1 },
    };
    const onSubmit = jest.fn();
    const expected = {
      name: 'Test User',
      email: 'test@test.com',
      licences: ['Rice'],
    };
    const { getByRole } = render(
      <CreateUserForm licenceInformation={licences} onSubmit={onSubmit} />,
    );
    userEvent.type(getByRole('textbox', { name: 'Name' }), expected.name);
    userEvent.type(getByRole('textbox', { name: 'Email' }), expected.email);
    userEvent.click(getByRole('checkbox', { name: 'Rice' }));
    userEvent.click(getByRole('button', { name: 'Create User' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expected));
  });

  it('Does not include licences which are disabled', async () => {
    const licences = {
      Rice: { available: 0 },
      Oil: { available: 1 },
    };
    const onSubmit = jest.fn();
    const expected = {
      name: 'Test User',
      email: 'test@test.com',
      licences: [],
    };
    const { getByRole } = render(
      <CreateUserForm licenceInformation={licences} onSubmit={onSubmit} />,
    );
    userEvent.type(getByRole('textbox', { name: 'Name' }), expected.name);
    userEvent.type(getByRole('textbox', { name: 'Email' }), expected.email);
    expect(getByRole('checkbox', { name: 'Rice' })).toBeDisabled();
    userEvent.click(getByRole('button', { name: 'Create User' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expected));
  });

  it('Shows an error if email is not provided', async () => {
    const { getByRole, getByText } = render(<CreateUserForm />);
    userEvent.click(getByRole('button', { name: 'Create User' }));
    await waitFor(() =>
      expect(getByText(MESSAGES.email.required)).toBeInTheDocument(),
    );
  });
});
