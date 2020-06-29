import React from 'react';
import { render, wait } from '@testing-library/react';
import { CreateUserForm } from './create-user-form.component';
import userEvent from '@testing-library/user-event';

describe('<CreateUserForm />', () => {
  it('Has a name field', () => {
    const { getByLabelText } = render(<CreateUserForm />);
    expect(getByLabelText('Name')).toBeInTheDocument();
  });

  it('Has an email field', () => {
    const { getByLabelText } = render(<CreateUserForm />);
    expect(getByLabelText('Email')).toBeInTheDocument();
  });

  it('Has a checkbox for each available licence', () => {
    const licences = [
      { orb: 'Rice', available: true },
      { orb: 'Oil', available: true },
    ];
    const { getByLabelText } = render(<CreateUserForm licences={licences} />);
    licences.forEach(licence => expect(getByLabelText(licence.orb)).toBeInTheDocument());
  });

  it('Shows a disabled checkbox for a licence which is unavailable', () => {
    const licences = [
      { orb: 'Rice', available: true },
      { orb: 'Oil', available: false },
    ];
    const { getByLabelText } = render(<CreateUserForm licences={licences} />);
    expect(getByLabelText(licences[1].orb)).toHaveProperty('disabled', true);
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
    const { getByText } = render(<CreateUserForm />);
    const button = getByText('Create User');
    expect(button).toBeInTheDocument();
    expect(button).toHaveProperty('type', 'submit');
  });

  it('Calls the onSubmit function with the form values on successful completion', async () => {
    const licences = [
      { orb: 'Oil', available: true },
      { orb: 'Rice', available: true },
    ];
    const onSubmit = jest.fn();
    const expected = { name: 'Test User', email: 'test@test.com', licences: ['Rice'] };
    const { getByText, getByLabelText } = render(<CreateUserForm licences={licences} onSubmit={onSubmit} />);
    userEvent.type(getByLabelText('Name'), expected.name);
    userEvent.type(getByLabelText('Email'), expected.email);
    userEvent.click(getByLabelText(licences[1].orb));
    userEvent.click(getByText('Create User'));
    await wait(() => expect(onSubmit).toHaveBeenCalledWith(expected));
  });

  it('Does not include licences which are disabled', async () => {
    const licences = [
      { orb: 'Oil', available: true },
      { orb: 'Rice', available: false },
    ];
    const onSubmit = jest.fn();
    const expected = { name: 'Test User', email: 'test@test.com', licences: [] };
    const { getByText, getByLabelText } = render(<CreateUserForm licences={licences} onSubmit={onSubmit} />);
    userEvent.type(getByLabelText('Name'), expected.name);
    userEvent.type(getByLabelText('Email'), expected.email);
    userEvent.click(getByLabelText(licences[1].orb));
    userEvent.click(getByText('Create User'));
    await wait(() => expect(onSubmit).toHaveBeenCalledWith(expected));
  });

  it('Shows an error if email is not provided', async () => {
    const { getByText } = render(<CreateUserForm />);
    userEvent.click(getByText('Create User'));
    await wait(() => {
      expect(getByText('Email is required')).toBeInTheDocument();
    });
  });
});
