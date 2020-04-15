import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MemoryRouter } from 'react-router-dom';

import PasswordChangeForm from './password-change-form.component';

const mockStore = configureMockStore([thunk]);

describe('Password Reset Form Component', () => {
  let changePassword = null;

  beforeEach(() => {
    changePassword = jest.fn();
    fetch.resetMocks();
  });

  afterEach(cleanup);

  it('should render a form', () => {
    const store = mockStore({});

    const { container, getByPlaceholderText, getByText, getAllByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordChangeForm />
        </Provider>
      </MemoryRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('Old Password')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password Confirmation')).toBeInTheDocument();
    // Check we use password component with hide/show buttons in the Hide state
    expect(getAllByText('Show')).toHaveLength(3);
    // Check password strength component exists
    expect(getByText('Password Strength:')).toBeInTheDocument();
    //Check Terms and Conditions checkbox
    expect(getByText('I agree with')).toBeInTheDocument();
    // Check form submit button
    expect(getByText('Change Password')).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Change Password')).toHaveAttribute('disabled');
  });

  it('should enable `Change Password` button when form is valid', async () => {
    const store = mockStore({});

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordChangeForm />
        </Provider>
      </MemoryRouter>
    );

    let password = getByPlaceholderText('Old Password');
    expect(password.value).toEqual('');
    fireEvent.change(password, { target: { value: 'oldpassword' } });
    expect(password.value).toEqual('oldpassword');

    password = getByPlaceholderText('New Password');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');

    password = getByPlaceholderText('New Password Confirmation');
    fireEvent.change(password, { target: { value: 'newpassword' } });
    expect(password.value).toEqual('newpassword');

    fireEvent.click(getByText('I agree with'));

    expect(getByText('Change Password')).not.toHaveAttribute('disabled');
  });

  it('should keep `Change Password` button disabled when form is invalid', () => {
    const store = mockStore({});

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordChangeForm />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('New Password Confirmation'), { target: { value: 'newpasswordconfirm' } });

    expect(getByText('Change Password')).toHaveAttribute('disabled');
  });

  it('should not call `changePassword` function when form is invalid and `Change Password` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));
    const store = mockStore({});

    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordChangeForm />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.click(getByText('Change Password'));
    expect(fetch.mock.calls.length).toBe(0);
  });

  it('should call `changePassword` function when form is valid and `Change Password` button clicked', () => {
    fetch.mockResponse(JSON.stringify({}, { status: 200 }));
    const store = mockStore({
      accounts: {
        userKey: 'KEY'
      }
    });

    const expectedResults = {
      old_password: 'oldpassword',
      new_password1: 'newpassword',
      new_password2: 'newpassword',
      accepted_terms: true
    };

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordChangeForm changePassword={changePassword} />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByPlaceholderText('New Password Confirmation'), { target: { value: 'newpassword' } });
    fireEvent.click(getByText('I agree with'));

    fireEvent.click(getByText('Change Password'));
    expect(changePassword).toHaveBeenCalledWith(expectedResults);
  });
});
