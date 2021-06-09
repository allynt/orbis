import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { status } from 'accounts/accounts.slice';
import { FIELD_NAMES } from 'utils/validators';

import PasswordChangeForm from './password-change-form.component';

const mockStore = configureMockStore([thunk]);

const OLD_PASSWORD_PLACEHOLDER_TEXT = 'Old Password';
const PASSWORD_PLACEHOLDER_TEXT = 'New Password';
const PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT = 'New Password Confirmation';
const OLD_PASSWORD_TEXT = 'oldpassword';
const NEW_PASSWORD_TEXT = 'newpassword';
const CHANGE_PASSWORD_BUTTON_LABEL = 'Change Password';
const I_AGREE_TEXT = 'I agree with Terms & Conditions';
const TERMS_URL = 'www.terms.com';

const renderComponent = (store, changePassword, changeStatus, error) =>
  render(
    <PasswordChangeForm
      termsUrl={TERMS_URL}
      changePassword={changePassword}
      changeStatus={changeStatus}
      error={error}
      passwordMinLength={0}
      passwordMaxLength={Infinity}
      passwordStrength={0}
    />,
    {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <Router history={createMemoryHistory()}>{children}</Router>
        </Provider>
      ),
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
    const { getByRole, getByText, getByLabelText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    expect(getByLabelText(OLD_PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(getByLabelText(PASSWORD_PLACEHOLDER_TEXT)).toBeInTheDocument();
    expect(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
    ).toBeInTheDocument();
    //Check Terms and Conditions checkbox
    expect(getByRole('checkbox', { name: I_AGREE_TEXT })).toBeInTheDocument();
    // Check form submit button
    const changePasswordButton = getByRole('button', {
      name: CHANGE_PASSWORD_BUTTON_LABEL,
    });
    expect(changePasswordButton).toBeInTheDocument();
    // Check link to login view
    expect(getByText('Login')).toBeInTheDocument();
    expect(changePasswordButton).toHaveAttribute('disabled');
  });

  it('should disable `Change Password` button when form is invalid', async () => {
    const { getByRole, getByLabelText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    userEvent.type(
      getByLabelText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      OLD_PASSWORD_TEXT,
    );
    userEvent.type(
      getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );
    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      'non-matching',
    );

    await waitFor(() =>
      expect(
        getByRole('button', { name: CHANGE_PASSWORD_BUTTON_LABEL }),
      ).toBeDisabled(),
    );
  });

  it('should enable `Change Password` button when form is valid', async () => {
    const { getByRole, getByLabelText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    userEvent.type(
      getByLabelText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      OLD_PASSWORD_TEXT,
    );

    userEvent.type(
      getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );

    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );

    expect(
      getByRole('button', { name: CHANGE_PASSWORD_BUTTON_LABEL }),
    ).toBeDisabled();
    waitFor(() =>
      userEvent.click(getByRole('checkbox', { name: I_AGREE_TEXT })),
    );

    expect(
      getByRole('button', { name: CHANGE_PASSWORD_BUTTON_LABEL }),
    ).not.toBeDisabled();
  });

  it('should call `changePassword` function when form is valid and `Change Password` button clicked', async () => {
    const { getByRole, getByLabelText } = renderComponent(
      store,
      changePassword,
      changeStatus,
      error,
    );

    userEvent.type(
      getByLabelText(OLD_PASSWORD_PLACEHOLDER_TEXT),
      OLD_PASSWORD_TEXT,
    );
    userEvent.type(
      getByLabelText(PASSWORD_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );
    userEvent.type(
      getByLabelText(PASSWORD_CONFIRMATION_PLACEHOLDER_TEXT),
      NEW_PASSWORD_TEXT,
    );

    userEvent.click(getByRole('checkbox', { name: I_AGREE_TEXT }));
    userEvent.click(
      getByRole('button', {
        name: CHANGE_PASSWORD_BUTTON_LABEL,
      }),
    );

    await waitFor(() =>
      expect(changePassword).toHaveBeenCalledWith({
        [FIELD_NAMES.oldPassword]: OLD_PASSWORD_TEXT,
        [FIELD_NAMES.newPassword]: NEW_PASSWORD_TEXT,
        [FIELD_NAMES.newPasswordConfirm]: NEW_PASSWORD_TEXT,
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
