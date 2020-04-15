import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MemoryRouter } from 'react-router-dom';

import PasswordResetConfirmForm from './password-reset-confirm-form.component';

const mockStore = configureMockStore([thunk]);

describe('Password Reset Form Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const store = mockStore({});

    const match = {
      params: 'value'
    };

    const { container, getByText, getAllByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordResetConfirmForm match={match} />
        </Provider>
      </MemoryRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password Confirmation')).toBeInTheDocument();
    // Check we use password component with hide/show buttons in the Hide state
    expect(getAllByText('Show')).toHaveLength(2);
    // Check password strength component exists
    expect(getByText('Password Strength:')).toBeInTheDocument();
    // Check form submit button
    expect(getByText('Reset Password')).toBeInTheDocument();
    // Check Terms and Conditions checkbox
    expect(getByText('I agree with')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Reset Password')).toHaveAttribute('disabled');
  });

  it('should enable `Reset` button when form is dirty', async () => {
    const store = mockStore({});

    const match = {
      params: 'value'
    };

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordResetConfirmForm match={match} />
        </Provider>
      </MemoryRouter>
    );

    const password = getByPlaceholderText('New Password');
    expect(password.value).toEqual('');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');
    expect(getByText('Reset Password')).toHaveAttribute('disabled');
  });

  it('should enable `Reset Password` button when form is valid', () => {
    const store = mockStore({});

    const match = {
      params: 'value'
    };

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordResetConfirmForm match={match} />
        </Provider>
      </MemoryRouter>
    );

    let password = getByPlaceholderText('New Password');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');

    password = getByPlaceholderText('New Password Confirmation');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');
    fireEvent.click(getByText('I agree with'));

    expect(getByText('Reset Password')).not.toHaveAttribute('disabled');
  });

  it('should not call `confirmChangePassword` function when form is invalid and `Reset Password` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));
    const store = mockStore({});

    const match = {
      params: 'value'
    };

    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordResetConfirmForm match={match} />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.click(getByText('Reset Password'));
    expect(fetch.mock.calls.length).toBe(0);
  });

  it('should call `confirmChangePassword` function when form is valid and `Reset Password` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));
    const store = mockStore({});

    const match = {
      params: 'value'
    };

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordResetConfirmForm match={match} />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('New Password Confirmation'), { target: { value: 'newpassword' } });
    fireEvent.click(getByText('I agree with'));

    fireEvent.click(getByText('Reset Password'));
    expect(fetch.mock.calls[0][0]).toEqual('/api/authentication/password/verify-reset/');
  });
});
