import { NotificationManager } from 'react-notifications';
import { createSlice, createSelector } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import {
  sendData,
  getData,
  JSON_HEADERS,
  getJsonAuthHeaders,
} from '../utils/http';

const API_PREFIX = '/api/authentication/';
const API = {
  register: API_PREFIX + 'registration/',
  activate: API_PREFIX + 'registration/verify-email/',
  resendVerificationEmail: API_PREFIX + 'send-email-verification/',
  login: API_PREFIX + 'login/',
  changePassword: API_PREFIX + 'password/change/',
  resetPassword: API_PREFIX + 'password/reset/',
  verifyResetPassword: API_PREFIX + 'password/verify-reset/',
  logout: API_PREFIX + 'logout/',
  user: '/api/users/',
};

export const status = {
  NONE: 'None',
  PENDING: 'Pending',
  COMPLETE: 'Complete',
};

// Shape error data into a single array of only error strings.
const errorTransformer = errorObject => {
  if (errorObject.detail) {
    return;
  } else {
    const errors = errorObject.errors;

    let errorMessages = [];
    for (const key of Object.keys(errors)) {
      for (const index in errors[key]) {
        const array = errors[key];
        errorMessages = [...errorMessages, array[index]];
      }
    }
    return errorMessages;
  }
};

const initialState = {
  userKey: null,
  user: null,
  error: null,
  registerUserStatus: status.NONE,
  accountActivationStatus: status.NONE,
  resetStatus: status.NONE,
  changeStatus: status.NONE,
  verificationEmailStatus: status.NONE,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    registerUserSuccess: state => {
      state.registerUserStatus = status.PENDING;
      state.error = null;
    },
    registerUserFailure: (state, { payload }) => {
      state.error = payload;
    },
    loginUserSuccess: (state, { payload }) => {
      state.userKey = payload;
      state.error = null;
    },
    loginUserFailure: (state, { payload }) => {
      state.error = payload;
    },
    resendVerificationEmailSuccess: state => {
      state.verificationEmailStatus = status.PENDING;
      state.error = null;
    },
    resendVerificationEmailFailure: (state, payload) => {
      state.error = payload;
    },
    fetchUserSuccess: (state, { payload }) => {
      state.user = payload;
      state.error = null;
    },
    fetchUserFailure: (state, { payload }) => {
      state.error = payload;
    },
    updateUserSuccess: (state, { payload }) => {
      state.user = payload;
      state.error = null;
    },
    updateUserFailure: (state, { payload }) => {
      state.error = payload;
    },
    logoutUserSuccess: state => {
      state.userKey = null;
      state.user = null;
      state.error = null;
    },
    logoutUserFailure: (state, { payload }) => {
      state.error = payload;
    },
    activateAccountSuccess: state => {
      state.accountActivationStatus = status.COMPLETE;
      state.error = null;
    },
    activateAccountFailure: (state, { payload }) => {
      state.error = payload;
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
    passwordResetRequestedSuccess: state => {
      state.resetStatus = status.COMPLETE;
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
} = accountsSlice.actions;

export const register = form => async dispatch => {
  const response = await sendData(API.register, form, JSON_HEADERS);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(registerUserFailure(errorTransformer(errorObject)));
  }

  return dispatch(registerUserSuccess());
};

export const activateAccount = form => async dispatch => {
  const response = await sendData(API.activate, form, JSON_HEADERS);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(activateAccountFailure(errorTransformer(errorObject)));
  }

  return dispatch(activateAccountSuccess());
};

export const fetchUser = (email = 'current') => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await getData(`${API.user}${email}/`, headers);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(fetchUserFailure(errorTransformer(errorObject)));
  }

  const user = await response.json();

  return dispatch(fetchUserSuccess(user));
};

export const login = form => async dispatch => {
  const response = await sendData(API.login, form, JSON_HEADERS);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(loginUserFailure(errorTransformer(errorObject)));
  }

  const userKey = (await response.json()).token;
  // Record the authentication key in state
  dispatch(loginUserSuccess(userKey));

  // Now that we have an authentication key, we can proceed to get user details
  return dispatch(fetchUser());
};

export const resendVerificationEmail = email => async dispatch => {
  const emailObj = { email };
  const response = await sendData(
    API.resendVerificationEmail,
    emailObj,
    JSON_HEADERS,
  );

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(resendVerificationEmailFailure(errorObject));
  }

  return dispatch(resendVerificationEmailSuccess());
};

export const logout = () => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(API.logout, {}, headers);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(logoutUserFailure(errorTransformer(errorObject)));
  }

  return dispatch(logoutUserSuccess());
};

export const changePassword = form => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(API.changePassword, form, headers);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(changePasswordFailure(errorTransformer(errorObject)));
  }

  return dispatch(changePasswordSuccess());
};

export const confirmResetPassword = (form, params) => async dispatch => {
  const { uid, token } = params;
  const data = {
    ...form,
    token,
    uid,
  };

  const response = await sendData(API.verifyResetPassword, data, JSON_HEADERS);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(
      passwordResetRequestedFailure(errorTransformer(errorObject)),
    );
  }

  return dispatch(passwordResetRequestedSuccess());
};

export const resetPassword = form => async dispatch => {
  const response = await sendData(API.resetPassword, form, JSON_HEADERS);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(resetPasswordFailure(errorTransformer(errorObject)));
  }

  return dispatch(resetPasswordSuccess());
};

export const updateUser = form => async (dispatch, getState) => {
  const {
    accounts: { user },
  } = getState();
  const headers = getJsonAuthHeaders(getState());

  const data = {
    ...user,
    ...form,
  };

  const response = await sendData(
    `${API.user}${user.id}/`,
    data,
    headers,
    'PUT',
  );

  if (!response.ok) {
    const error = await response.json();
    const errorObject = errorTransformer(error);
    NotificationManager.error('Error updating user', '', 5000, () => {});
    return dispatch(updateUserFailure(errorObject));
  }

  const userObj = await response.json();

  NotificationManager.success('Successfully updated user', '', 5000, () => {});
  return dispatch(updateUserSuccess(userObj));
};

const persistConfig = {
  key: 'accounts',
  whitelist: ['userKey'],
  storage,
};

const baseSelector = state => state?.accounts;
export const userSelector = createSelector(
  baseSelector,
  accounts => accounts?.user,
);

export default persistReducer(persistConfig, accountsSlice.reducer);
