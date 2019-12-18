import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MemoryRouter } from 'react-router-dom';

import RegisterForm from './register-form.component';

const mockStore = configureMockStore([thunk]);

describe('Register Form Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const store = mockStore({
      accounts: {
        error: 'Test Error'
      }
    });

    const { container, getByText, getAllByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm />
        </Provider>
      </MemoryRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Password Confirmation')).toBeInTheDocument();
    // Check we use password component with hide/show buttons in the Hide state
    expect(getAllByText('Show')).toHaveLength(2);
    // Check password strength component exists
    expect(getByText('Password Strength:')).toBeInTheDocument();
    // Check form submit button
    expect(getByText('Sign Up')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Sign Up')).toHaveAttribute('disabled');
  });

  it('should enable `Sign Up` button when form is valid', async () => {
    const store = mockStore({
      accounts: {
        error: 'Test Error'
      }
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'pandasconcreterealty' } });
    fireEvent.change(getByPlaceholderText('Password Confirmation'), { target: { value: 'pandasconcreterealty' } });
    expect(getByText('Sign Up')).not.toHaveAttribute('disabled');
  });

  it('should keep `Sign Up` button disabled when form is invalid', () => {
    const store = mockStore({
      accounts: {
        error: 'Test Error'
      }
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });

    expect(getByText('Sign Up')).toHaveAttribute('disabled');
  });

  it('should not call register function when form is invalid and `Sign Up` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));
    const store = mockStore({
      accounts: {
        error: 'Test Error'
      }
    });

    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.click(getByText('Sign Up'));
    expect(fetch.mock.calls.length).toBe(0);
  });

  it('should call register function when form is valid and `Sign Up` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));
    const store = mockStore({
      accounts: {
        error: 'Test Error'
      }
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <RegisterForm />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'pandasconcreterealty' } });
    fireEvent.change(getByPlaceholderText('Password Confirmation'), { target: { value: 'pandasconcreterealty' } });

    fireEvent.click(getByText('Sign Up'));
    expect(fetch.mock.calls[0][0]).toEqual('/api/authentication/registration/');
  });
});
