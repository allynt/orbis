import React from 'react';
import { render } from '@testing-library/react';
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
      { name: 'Rice', available: true },
      { name: 'Oil', available: true },
    ];
    const { getByLabelText } = render(<CreateUserForm licences={licences} />);
    licences.forEach(licence => expect(getByLabelText(licence.name)).toBeInTheDocument());
  });

  it('Shows a disabled checkbox for a licence which is unavailable', () => {
    const licences = [
      { name: 'Rice', available: true },
      { name: 'Oil', available: false },
    ];
    const { getByLabelText } = render(<CreateUserForm licences={licences} />);
    expect(getByLabelText(licences[1].name)).toHaveProperty('disabled', true);
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

  it('Calls the onSubmit function when submit button is clicked', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<CreateUserForm onSubmit={onSubmit} />);
    userEvent.click(getByText('Create User'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('Calls the onSubmit function with the form values', () => {
    const licences = [
      { name: 'Oil', available: true },
      { name: 'Rice', available: true },
    ];
    const onSubmit = jest.fn();
    const expected = { name: 'Test User', email: 'test@test.com', licences: ['Rice'] };
    const { getByText, getByLabelText } = render(<CreateUserForm licences={licences} onSubmit={onSubmit} />);
    userEvent.type(getByLabelText('Name'), expected.name);
    userEvent.type(getByLabelText('Email'), expected.email);
    userEvent.click(getByLabelText(licences[1].name));
    userEvent.click(getByText('Create User'));
    expect(onSubmit).toHaveBeenCalledWith(expected);
  });
});
