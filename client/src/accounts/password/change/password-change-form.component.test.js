import React from 'react';

import { render, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { status } from 'accounts/accounts.slice';

import PasswordChangeForm from './password-change-form.component';

const mockStore = configureMockStore([thunk]);

const OLD_PASSWORD_PLACEHOLDER_TEXT = 'Old Password';
const PASSWORD_PLACEHOLDER_TEXT = 'New Password';
const PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT = 'New Password Confirmation';
const OLD_PASSWORD_TEXT = 'oldpassword';
const NEW_PASSWORD_TEXT = 'newpassword';
const CHANGE_PASSWORD_BUTTON_LABEL = 'Change Password';
const I_AGREE_TEXT = 'I agree with';

const renderComponent = (store, changePassword, changeStatus, error) =>
  render(
    <PasswordChangeForm
      changePassword={changePassword}
      changeStatus={changeStatus}
      error={error}
    />,
    {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    },
  );

describe('Password Change Form Component', () => {
  let store;
  let changePassword = null;
  let error = null;
  let changeStatus = null;

  beforeEach(() => {
    store = mockStore({
      app: {
        config: {
          passwordMinLength: 2,
          passwordMaxLength: 50,
        },
      },
    });
    changePassword = jest.fn();
    error = null;
    changeStatus = 'None';
  });

  it('should render a form', () => {
    const { getByRole, getByPlaceholderText, getByText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    expect(
      getByPlaceholderText(OLD_PASSWORD_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    expect(getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    //Check Terms and Conditions checkbox
    expect(getByText(I_AGREE_TEXT)).toBeInTheDocument();
    // Check form submit button
    const changePasswordButton = getByRole('button', {
      name: CHANGE_PASSWORD_BUTTON_LABEL,
    });
    expect(changePasswordButton).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(changePasswordButton).toHaveAttribute('disabled');
  });

  it('should disable `Change Password` button when form is invalid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    userEvent.type(
      getByPlaceholderText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      OLD_PASSWORD_TEXT,
    );
    userEvent.type(
      getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );
    userEvent.type(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      'non-matching',
    );

    expect(getByText(CHANGE_PASSWORD_BUTTON_LABEL)).toHaveAttribute('disabled');
  });

  it('should enable `Change Password` button when form is valid', async () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    let password = getByPlaceholderText(OLD_PASSWORD_PLACEHOLDER_TEXT);
    expect(password.value).toEqual('');

    userEvent.type(password, OLD_PASSWORD_TEXT);
    expect(password.value).toEqual(OLD_PASSWORD_TEXT);

    password = getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT);
    userEvent.type(password, NEW_PASSWORD_TEXT);
    expect(password.value).toEqual(NEW_PASSWORD_TEXT);

    password = getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT);
    userEvent.type(password, NEW_PASSWORD_TEXT);
    expect(password.value).toEqual(NEW_PASSWORD_TEXT);

    expect(getByText(CHANGE_PASSWORD_BUTTON_LABEL)).toHaveAttribute('disabled');
    waitFor(() => userEvent.click(getByText(I_AGREE_TEXT)));

    expect(getByText(CHANGE_PASSWORD_BUTTON_LABEL)).not.toHaveAttribute(
      'disabled',
    );
  });

  it('should not call `changePassword` function when form is invalid and `Change Password` button clicked', () => {
    const { getByRole, getByPlaceholderText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    userEvent.type(
      getByPlaceholderText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      'testpassword',
    );

    waitFor(async () => await userEvent.tab());

    userEvent.click(
      getByRole('button', { name: CHANGE_PASSWORD_BUTTON_LABEL }),
    );
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('should call `changePassword` function when form is valid and `Change Password` button clicked', async () => {
    const { getByRole, getByText, getByPlaceholderText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    userEvent.type(
      getByPlaceholderText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      OLD_PASSWORD_TEXT,
    );
    userEvent.type(
      getByPlaceholderText(PASSWORD_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );
    userEvent.type(
      getByPlaceholderText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );

    userEvent.click(getByText(I_AGREE_TEXT));
    userEvent.click(
      getByRole('button', {
        name: CHANGE_PASSWORD_BUTTON_LABEL,
      }),
    );

    await waitFor(() =>
      expect(changePassword).toHaveBeenCalledWith({
        old_password: OLD_PASSWORD_TEXT,
        new_password1: NEW_PASSWORD_TEXT,
        new_password2: NEW_PASSWORD_TEXT,
        accepted_terms: true,
      }),
    );
  });

  it('should display error well if password reset is unsuccessful', () => {
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = renderComponent(
      store,
      changePassword,
      status.NONE,
      error,
    );

    expect(getByTestId('error-well')).toBeInTheDocument();
  });

  describe('Password Change Success View', () => {
    it('should show the Password Change success view', () => {
      const { getByText } = renderComponent(
        store,
        changePassword,
        status.PENDING,
        error,
      );

      expect(
        getByText('Thank you! Your password has been changed.'),
      ).toBeInTheDocument();

      expect(getByText('Continue')).toBeInTheDocument();
    });
  });
});
