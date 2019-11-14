import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import RegisterForm from './register-form.component';

describe('Register Form Component', () => {
  let register = null;

  beforeEach(() => {
    register = jest.fn();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getAllByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <RegisterForm register={register} />
      </MemoryRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('EmailWTF')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Password Confirmation')).toBeInTheDocument();
    // Check we use password component with hide/show buttons in the Hide state
    expect(getAllByText('Hide')).toHaveLength(2);
    // Check password strength component exists
    expect(getByText('Password Strength:')).toBeInTheDocument();
    // Check form submit button
    expect(getByText('Sign Up')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Sign Up')).toHaveAttribute('disabled');
  });

  it('should enable `Sign Up` button when form is valid', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <RegisterForm register={register} />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('EmailWTF'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'pandasconcreterealty' } });
    fireEvent.change(getByPlaceholderText('Password Confirmation'), { target: { value: 'pandasconcreterealty' } });
    expect(getByText('Sign Up')).not.toHaveAttribute('disabled');
  });

  it('should keep `Sign Up` button disabled when form is invalid', () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <RegisterForm register={register} />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('EmailWTF'), { target: { value: 'test@test.com' } });

    expect(getByText('Sign Up')).toHaveAttribute('disabled');
  });

  it('should not call register function when form is invalid and `Sign Up` button clicked', () => {
    const { getByText } = render(
      <MemoryRouter>
        <RegisterForm register={register} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Sign Up'));
    expect(register).not.toHaveBeenCalled();
  });

  it('should call register function when form is valid and `Sign Up` button clicked', () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <RegisterForm register={register} />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('EmailWTF'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'pandasconcreterealty' } });
    fireEvent.change(getByPlaceholderText('Password Confirmation'), { target: { value: 'pandasconcreterealty' } });

    fireEvent.click(getByText('Sign Up'));
    expect(register).toHaveBeenCalled();
  });
});
