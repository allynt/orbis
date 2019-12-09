import { NotificationManager } from 'react-notifications';

import { history } from '../store';

import { sendData, getData, JSON_HEADERS } from '../utils/http';

export const LOGIN_REQUESTED_SUCCESS = 'LOGIN_REQUESTED_SUCCESS';
export const LOGIN_REQUESTED_FAILURE = 'LOGIN_REQUESTED_FAILURE';

export const REGISTER_REQUESTED_SUCCESS = 'REGISTER_REQUESTED_SUCCESS';
export const REGISTER_REQUESTED_FAILURE = 'REGISTER_REQUESTED_FAILURE';

export const LOGOUT_REQUESTED_SUCCESS = 'LOGOUT_REQUESTED_SUCCESS';
export const LOGOUT_REQUESTED_FAILURE = 'LOGOUT_REQUESTED_FAILURE';

export const FETCH_USER_REQUESTED_SUCCESS = 'FETCH_USER_REQUESTED_SUCCESS';
export const FETCH_USER_REQUESTED_FAILURE = 'FETCH_USER_REQUESTED_FAILURE';

export const UPDATE_USER_REQUESTED_SUCCESS = 'UPDATE_USER_REQUESTED_SUCCESS';
export const UPDATE_USER_REQUESTED_FAILURE = 'UPDATE_USER_REQUESTED_FAILURE';

const API_PREFIX = '/api/authentication/';
const API = {
  register: API_PREFIX + 'registration/',
  activate: API_PREFIX + 'registration/verify-email/',
  login: API_PREFIX + 'login/',
  changePassword: API_PREFIX + 'password/change/',
  resetPassword: API_PREFIX + 'password/reset/',
  verifyResetPassword: API_PREFIX + 'password/reset/verify-reset/',
  logout: API_PREFIX + 'logout/',
  user: '/api/users/'
};

/**
 * Call API with user details. If there is an problem with the
 * request, then dispatch an error action, otherwise, dispatch
 * a success action.
 *
 * @param {*} form
 */
export const register = form => async dispatch => {
  const data = {
    ...form,
    username: form.email
  };

  const response = await sendData(API.register, data, JSON_HEADERS);

  if (!response.ok) {
    const error = await response.json();

    NotificationManager.error(error.message, `"Registration Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: REGISTER_REQUESTED_FAILURE,
      error: error
    });
  }

  NotificationManager.success(
    'Successfully registered, verification email has been sent',
    'Successful Registration',
    5000,
    () => {}
  );
  dispatch({ type: REGISTER_REQUESTED_SUCCESS });
  history.push('/login');
};

export const activateAccount = form => async () => {
  const response = await sendData(API.activate, form, JSON_HEADERS);

  if (!response.ok) {
    const errorResponse = await response.json();
    const error = new Error(errorResponseToString(errorResponse));

    NotificationManager.error(
      error.message,
      `Registration Verification Error - ${response.statusText}`,
      50000,
      () => {}
    );
  } else {
    NotificationManager.success('Successfully verified registration', 'Successful account activation', 5000, () => {});
  }
};

export const fetchUser = (email = 'current') => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();

  const url = `${API.user}${email}`;
  const headers = {
    ...JSON_HEADERS,
    Authorization: 'Token ' + userKey
  };

  const response = await getData(url, headers);

  if (!response.ok) {
    const error = new Error();
    error.message = response.statusText;

    return dispatch({
      type: FETCH_USER_REQUESTED_FAILURE
    });
  }

  const user = await response.json();

  return dispatch({ type: FETCH_USER_REQUESTED_SUCCESS, user });
};

/**
 * Call API with user credentials and receive a user object in response.
 * If there is an problem with the request, then dispatch an error action,
 * otherwise, dispatch a success action.
 *
 * @param {*} form
 */
export const login = form => async dispatch => {
  const response = await sendData(API.login, form, JSON_HEADERS);

  if (!response.ok) {
    const errorResponse = await response.json();
    const error = new Error(errorResponseToString(errorResponse));

    NotificationManager.error(error.message, `Login Error - ${response.statusText}`, 50000, () => {});
    return dispatch({
      type: LOGIN_REQUESTED_FAILURE,
      error
    });
  }

  const userKey = (await response.json()).token;

  NotificationManager.success('Successfully logged in', 'Successful Login', 5000, () => {});

  // Record the authentication key in state
  dispatch({ type: LOGIN_REQUESTED_SUCCESS, userKey });

  // Now that we have an authentication key, we can proceed to get user details
  return dispatch(fetchUser());
};

/**
 *
 *
 */
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
    const error = new Error();
    error.message = response.statusText;
    alert('Error logging out');

    return dispatch({
      type: LOGOUT_REQUESTED_FAILURE,
      error
    });
  }

  dispatch({ type: LOGOUT_REQUESTED_SUCCESS });
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
    const error = new Error();
    error.message = response.statusText;
    NotificationManager.error(error.message, 'Change Password Error', 50000, () => {});
  } else {
    NotificationManager.success('Successfully changed password', 'Successful Password Change', 5000, () => {});
  }
};

export const resetPassword = form => async () => {
  const response = await sendData(API.resetPassword, form, JSON_HEADERS);

  if (!response.ok) {
    const error = new Error();
    error.message = response.statusText;
    NotificationManager.error(error.message, 'Password Reset Error', 50000, () => {});
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
    const error = new Error();
    error.message = response.statusText;
    NotificationManager.error(error.message, 'Password Reset Error', 50000, () => {});
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
    const error = new Error();
    error.message = response.statusText;
    NotificationManager.error(error.message, 'Update User Error', 50000, () => {});

    return dispatch({
      type: UPDATE_USER_REQUESTED_FAILURE,
      error
    });
  }

  const userObj = await response.json();
  NotificationManager.success('Successfully updated user', 'Successful User Update', 5000, () => {});
  return dispatch({ type: UPDATE_USER_REQUESTED_SUCCESS, user: userObj });
};

const errorResponseToString = response => {
  // Reduce all field errors to a single string representation.
  const errorStr = Object.keys(response).reduce((acc, key) => {
    const fieldErrors = response[key];

    if (Array.isArray(fieldErrors)) {
      // Reduce array of field errors to a single string representation.
      const errors = fieldErrors.reduce((acc, error) => {
        return (acc += error + ' ');
      }, '');
      acc += `${key} - ${errors}\n`;
    } else if (typeof fieldErrors === 'string' || fieldErrors instanceof String) {
      acc += fieldErrors;
    }

    return acc;
  }, '');

  return errorStr;
};
