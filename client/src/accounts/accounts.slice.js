import { NotificationManager } from 'react-notifications';

import { createSlice } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import { history } from '../root.reducer';

import { sendData, getData, JSON_HEADERS } from '../utils/http';

const API_PREFIX = '/api/authentication/';
const API = {
  register: API_PREFIX + 'registration/',
  activate: API_PREFIX + 'registration/verify-email/',
  login: API_PREFIX + 'login/',
  changePassword: API_PREFIX + 'password/change/',
  resetPassword: API_PREFIX + 'password/reset/',
  verifyResetPassword: API_PREFIX + 'password/verify-reset/',
  logout: API_PREFIX + 'logout/',
  user: '/api/users/'
};

const initialState = {
  userKey: null,
  user: null,
  error: null
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    registerUserSuccess: state => {
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
    logoutUserSuccess: (state, { payload }) => {
      state.userKey = null;
      state.user = null;
      state.error = null;
    },
    logoutUserFailure: (state, { payload }) => {
      state.error = payload;
    }
  }
});

export const {
  registerUserSuccess,
  registerUserFailure,
  loginUserSuccess,
  loginUserFailure,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserSuccess,
  updateUserFailure,
  logoutUserSuccess,
  logoutUserFailure
} = accountsSlice.actions;

export const register = form => async dispatch => {
  const data = {
    ...form,
    username: form.email
  };

  const response = await sendData(API.register, data, JSON_HEADERS);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `"Registration Error - ${response.statusText}`, 50000, () => {});

    return dispatch(registerUserFailure({ message }));
  }

  NotificationManager.success(
    'Successfully registered, verification email has been sent',
    'Successful Registration',
    5000,
    () => {}
  );

  history.push('/login');

  return dispatch(registerUserSuccess());
};

export const activateAccount = form => async () => {
  const response = await sendData(API.activate, form, JSON_HEADERS);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Registration Verification Error - ${response.statusText}`, 50000, () => {});
  } else {
    NotificationManager.success('Successfully verified registration', 'Successful account activation', 5000, () => {});
  }
};

export const fetchUser = (email = 'current') => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();

  const url = `${API.user}${email}/`;
  const headers = {
    ...JSON_HEADERS,
    Authorization: 'Token ' + userKey
  };

  const response = await getData(url, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    return dispatch(fetchUserFailure({ message }));
  }

  const user = await response.json();

  return dispatch(fetchUserSuccess(user));
};

export const login = form => async dispatch => {
  const response = await sendData(API.login, form, JSON_HEADERS);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Login Error - ${response.statusText}`, 50000, () => {});

    return dispatch(loginUserFailure({ message }));
  }

  const userKey = (await response.json()).token;

  NotificationManager.success('Successfully logged in', 'Successful Login', 5000, () => {});

  // Record the authentication key in state
  dispatch(loginUserSuccess(userKey));

  // Now that we have an authentication key, we can proceed to get user details
  return dispatch(fetchUser());
};

export const logout = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();

  const url = API.logout;
  const headers = {
    ...JSON_HEADERS,
    Authorization: 'Token ' + userKey
  };

  const response = await sendData(url, {}, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Logout Error - ${response.statusText}`, 50000, () => {});

    return dispatch(logoutUserFailure({ message }));
  }

  return dispatch(logoutUserSuccess());
};

export const changePassword = form => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();

  const url = API.changePassword;
  const headers = {
    ...JSON_HEADERS,
    Authorization: 'Token ' + userKey
  };

  const response = await sendData(url, form, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Change Password Error', 50000, () => {});
  } else {
    NotificationManager.success('Successfully changed password', 'Successful Password Change', 5000, () => {});
  }
};

export const resetPassword = form => async () => {
  const response = await sendData(API.resetPassword, form, JSON_HEADERS);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Password Reset Error', 50000, () => {});
  } else {
    NotificationManager.success('Successfully Reset password', 'Successful Password Reset', 5000, () => {});
  }
};

export const confirmChangePassword = (form, params) => async () => {
  const { uid, token } = params;
  const data = {
    ...form,
    token,
    uid
  };

  const response = await sendData(API.verifyResetPassword, data, JSON_HEADERS);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Password Reset Error', 50000, () => {});
  } else {
    NotificationManager.success('Successfully Reset password', 'Successful Password Reset', 5000, () => {});
  }
};

export const updateUser = form => async (dispatch, getState) => {
  const {
    accounts: { user, userKey }
  } = getState();

  const url = `${API.user}${user.email}/`;
  const headers = {
    ...JSON_HEADERS,
    Authorization: 'Token ' + userKey
  };
  const data = {
    ...user,
    ...form,
    name: `${form.first_name} ${form.last_name}`
  };

  const response = await sendData(url, data, headers, 'PUT');

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Update User Error', 50000, () => {});

    return dispatch(updateUserFailure({ message }));
  }

  const userObj = await response.json();
  NotificationManager.success('Successfully updated user', 'Successful User Update', 5000, () => {});

  return dispatch(updateUserSuccess(userObj));
};

const persistConfig = {
  key: 'accounts',
  whitelist: ['userKey'],
  storage
};

export default persistReducer(persistConfig, accountsSlice.reducer);
