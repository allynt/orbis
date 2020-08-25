import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MemoryRouter } from 'react-router-dom';

import RegisterForm from './register-form.component';

const mockStore = configureMockStore([thunk]);

const testAppConfig = {
  passwordMinLength: 8,
  passwordMaxLength: 255,
  passwordStrength: 2,
  isRegistrationOpen: true,
  isVerificationRequired: true,
  isApprovalRequired: false,
};

describe('Register Form Component', () => {
  let store;
  let register = null;
  let error = null;

  beforeEach(() => {
    fetch.resetMocks();
    store = mockStore({
      accounts: { error: 'Test Error' },
      app: { config: testAppConfig },
    });
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];
    register = jest.fn();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const { container, getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm register={register} error={error} />
        </Provider>
      </MemoryRouter>,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Password Confirmation')).toBeInTheDocument();
    expect(getByText('I agree with')).toBeInTheDocument();

    //Check the I agree with button is in the document and has the correct href
    expect(getByText('Terms & Conditions, Privacy Policy')).toBeInTheDocument();
    expect(getByText('Terms & Conditions, Privacy Policy').href).toContain(
      '/terms',
    );
    // Check form submit button
    expect(getByText('Sign Up')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Sign Up')).toHaveAttribute('disabled');
  });

  it('should enable `Sign Up` button when form is valid', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm register={register} error={error} />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'pandasconcreterealty' },
    });
    fireEvent.change(getByPlaceholderText('Password Confirmation'), {
      target: { value: 'pandasconcreterealty' },
    });
    fireEvent.click(getByText('I agree with'));
    expect(getByText('Sign Up')).not.toHaveAttribute('disabled');
  });

  it('should keep `Sign Up` button disabled when form is invalid', () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm register={register} error={error} />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    expect(getByText('Sign Up')).toHaveAttribute('disabled');
  });

  it('should keep `Sign Up` button disabled when registration is disabled', () => {
    store = mockStore({
      accounts: { error: 'Test Error' },
      app: { config: { ...testAppConfig, isRegistrationOpen: false } },
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm register={register} error={error} />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'pandasconcreterealty' },
    });
    fireEvent.change(getByPlaceholderText('Password Confirmation'), {
      target: { value: 'pandasconcreterealty' },
    });

    expect(getByText('Sign Up')).toHaveAttribute('disabled');
  });

  it('should not call register function when form is invalid and `Sign Up` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));

    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm register={register} error={error} />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.click(getByText('Sign Up'));
    expect(fetch.mock.calls.length).toBe(0);
  });

  it('should call register function when form is valid and `Sign Up` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));

    const expectedResults = {
      email: 'test@test.com',
      password1: 'pandasconcreterealty',
      password2: 'pandasconcreterealty',
      accepted_terms: true,
    };

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm register={register} error={error} />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'pandasconcreterealty' },
    });
    fireEvent.change(getByPlaceholderText('Password Confirmation'), {
      target: { value: 'pandasconcreterealty' },
    });
    fireEvent.click(getByText('I agree with'));

    fireEvent.click(getByText('Sign Up'));
    expect(register).toHaveBeenCalledWith(expectedResults);
  });
});
