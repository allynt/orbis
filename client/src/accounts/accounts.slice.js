import { createSlice } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import {
  createCustomerUserSuccess,
  selectCurrentCustomer,
  setCurrentCustomer,
} from 'admin/admin.slice';
import apiClient from 'api-client';

import {
  REGISTER_CUSTOMER,
  REGISTER_CUSTOMER_ORDER,
  RESEND,
} from './accounts.constants';
import { userSelector } from './accounts.selectors';

export const status = {
  NONE: 'None',
  PENDING: 'Pending',
  COMPLETE: 'Complete',
};

const initialState = {
  userKey: null,
  user: null,
  error: null,
  isLoading: false,
  resetStatus: status.NONE,
  changeStatus: status.NONE,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    fetchRequested: state => {
      state.isLoading = true;
    },
    registerUserSuccess: (state, { payload }) => {
      state.user = payload;
      state.error = null;
      state.isLoading = false;
    },
    registerUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    registerCustomerSuccess: state => {
      state.error = null;
      state.isLoading = false;
    },
    registerCustomerFailure: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    placeOrderSuccess: state => {
      state.error = null;
      state.isLoading = false;
    },
    placeOrderFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    loginUserSuccess: (state, { payload }) => {
      state.userKey = payload.userKey;
      state.user = payload.user;
      state.error = null;
      state.isLoading = false;
    },
    loginUserFailure: (state, { payload }) => {
      state.user = payload.user;
      state.userKey = null;
      state.error = payload.errors;
      state.isLoading = false;
    },
    resendVerificationEmailSuccess: state => {
      state.error = null;
      state.isLoading = false;
    },
    resendVerificationEmailFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    fetchUserSuccess: (state, { payload }) => {
      state.user = payload;
      state.error = null;
      state.isLoading = false;
    },
    fetchUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    updateUserSuccess: (state, { payload }) => {
      state.user = payload;
      state.error = null;
      state.isLoading = false;
    },
    updateUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    logoutUserSuccess: state => {
      state.userKey = null;
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
    logoutUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    activateAccountSuccess: (state, { payload }) => {
      state.user = payload.user;
      state.userKey = null;
      state.error = null;
      state.isLoading = false;
    },
    activateAccountFailure: (state, { payload }) => {
      state.error = payload;
      state.userKey = null;
      state.isLoading = false;
    },
    changePasswordSuccess: state => {
      state.changeStatus = status.PENDING;
      state.error = null;
    },
    changePasswordFailure: (state, { payload }) => {
      state.error = payload;
    },
    resetPasswordSuccess: state => {
      state.resetStatus = status.PENDING;
      state.error = null;
    },
    resetPasswordFailure: (state, { payload }) => {
      state.error = payload;
    },
    passwordResetRequestedSuccess: (state, { payload }) => {
      state.resetStatus = status.COMPLETE;
      state.user = payload;
      state.error = null;
    },
    passwordResetRequestedFailure: (state, { payload }) => {
      state.error = payload;
    },
  },
});

export const {
  registerUserSuccess,
  registerUserFailure,
  registerCustomerSuccess,
  registerCustomerFailure,
  placeOrderSuccess,
  placeOrderFailure,
  loginUserSuccess,
  loginUserFailure,
  resendVerificationEmailSuccess,
  resendVerificationEmailFailure,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserSuccess,
  updateUserFailure,
  logoutUserSuccess,
  logoutUserFailure,
  activateAccountSuccess,
  activateAccountFailure,
  changePasswordSuccess,
  changePasswordFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  passwordResetRequestedSuccess,
  passwordResetRequestedFailure,
  fetchRequested,
} = accountsSlice.actions;

/**
 * @param {import('./register/customer/user-registration/user-registration.component').FormValues} form
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const registerUser = form => async dispatch => {
  dispatch(fetchRequested());
  try {
    const user = await apiClient.authentication.registerUser(form);
    dispatch(registerUserSuccess(user));
    return dispatch(push(RESEND));
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(registerUserFailure(errors));
  }
};

/**
 * This creates a customer but also adds the current user as a CustomerUser
 *
 * @param {import('./register/customer/customer-registration/customer-registration.component').FormValues} form
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const registerCustomer = form => async dispatch => {
  dispatch(fetchRequested());
  try {
    const customer = await apiClient.customers.createCustomer({
      ...form,
      type: 'MULTIPLE',
    });
    dispatch(setCurrentCustomer(customer));
    const customerUser = await apiClient.customers.createCustomerUser(
      customer.id,
      {
        type: 'MANAGER',
        status: 'ACTIVE',
        user: {
          email: form.email,
        },
        licences: [],
      },
    );
    dispatch(createCustomerUserSuccess({ user: customerUser }));
    const user = await apiClient.users.getCurrentUser();
    dispatch(fetchUserSuccess(user));
    dispatch(registerCustomerSuccess());
    return dispatch(push(REGISTER_CUSTOMER_ORDER));
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(registerCustomerFailure(errors));
  }
};

/**
 * @param {import('./register/customer/order-form/order-form.component').FormValues} form
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const placeOrder = form => async (dispatch, getState) => {
  dispatch(fetchRequested());
  const currentCustomerId =
    selectCurrentCustomer(getState())?.id ||
    userSelector(getState())?.customers[0]?.id;
  try {
    await apiClient.customers.placeOrder(currentCustomerId, form);
    const customer = await apiClient.customers.getCustomer(currentCustomerId);
    dispatch(setCurrentCustomer(customer));
    dispatch(placeOrderSuccess());
    dispatch(push('/'));
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(placeOrderFailure(errors));
  }
};

/**
 * @param {{key: string}} form
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const activateAccount = form => async dispatch => {
  dispatch(fetchRequested());
  try {
    const { user } = await apiClient.authentication.verifyEmail(form);
    return dispatch(activateAccountSuccess({ user }));
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(activateAccountFailure(errors));
  }
};

export const fetchCurrentUser = () => async dispatch => {
  dispatch(fetchRequested());
  try {
    const user = await apiClient.users.getCurrentUser();
    return dispatch(fetchUserSuccess(user));
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(fetchUserFailure(errors));
  }
};

export const login = form => async dispatch => {
  dispatch(fetchRequested());
  try {
    const { token: userKey } = await apiClient.authentication.login(form);
    apiClient.userKey = userKey;
    const user = await apiClient.users.getCurrentUser();
    dispatch(loginUserSuccess({ userKey, user }));
    switch (user.registration_stage) {
      case 'CUSTOMER':
      case 'CUSTOMER_USER':
        return dispatch(push(REGISTER_CUSTOMER));
      case 'ORDER':
        return dispatch(push(REGISTER_CUSTOMER_ORDER));
      default:
        return dispatch(push('/'));
    }
  } catch (error) {
    /** @type {import('api-client').ResponseError<{user?: PartialUser}>} */
    const responseError = error;
    const responseBody = await responseError.getBody();
    if (responseBody.user?.is_verified === false) dispatch(push(RESEND));
    const errors = await responseError.getErrors();
    return dispatch(
      loginUserFailure({
        user: responseBody.user,
        errors,
      }),
    );
  }
};

/**
 * @param {User['email']} email
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const resendVerificationEmail = email => async dispatch => {
  dispatch(fetchRequested());
  try {
    await apiClient.authentication.sendVerificationEmail({ email });
    return dispatch(resendVerificationEmailSuccess());
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(resendVerificationEmailFailure(errors));
  }
};

export const logout = () => async dispatch => {
  dispatch(fetchRequested());
  try {
    await apiClient.authentication.logout();
    apiClient.userKey = '';
    return dispatch(logoutUserSuccess());
  } catch (error) {
    const errors = await /** @type {import('api-client').ResponseError} */ (error).getErrors();
    return dispatch(logoutUserFailure(errors));
  }
};

/**
 * @param {{newPassword: string, newPasswordConfirm: string}} form
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const changePassword = form => async dispatch => {
  try {
    await apiClient.authentication.changePassword(form);
    return dispatch(changePasswordSuccess());
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(changePasswordFailure(errors));
  }
};

/**
 * @param {{newPassword: string, newPasswordConfirm: string}} form
 * @param {{uid: string, token: string}} params
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const confirmResetPassword = (form, params) => async dispatch => {
  try {
    const { user } = await apiClient.authentication.resetPasswordVerify({
      ...form,
      ...params,
    });
    return dispatch(passwordResetRequestedSuccess(user));
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(passwordResetRequestedFailure(errors));
  }
};

/**
 * @param {{email: User['email']}} form
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const resetPassword = form => async dispatch => {
  try {
    await apiClient.authentication.resetPasswordRequest(form);
    return dispatch(resetPasswordSuccess());
  } catch (responseError) {
    const errors = await responseError.getErrors();
    return dispatch(resetPasswordFailure(errors));
  }
};

export const updateUser = form => async (dispatch, getState) => {
  dispatch(fetchRequested());
  const {
    accounts: { user },
  } = getState();

  const userWithUpdates = {
    ...user,
    ...form,
  };

  try {
    const updatedUser = await apiClient.users.updateUser(userWithUpdates);
    NotificationManager.success(
      'Successfully updated user',
      '',
      5000,
      () => {},
    );
    return dispatch(updateUserSuccess(updatedUser));
  } catch (responseError) {
    const errors = await responseError.getErrors();
    NotificationManager.error('Error updating user', '', 5000, () => {});
    return dispatch(updateUserFailure(errors));
  }
};

const persistConfig = {
  key: 'accounts',
  whitelist: ['userKey'],
  storage,
};

export default persistReducer(persistConfig, accountsSlice.reducer);
