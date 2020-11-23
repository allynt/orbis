import { createSlice } from '@reduxjs/toolkit';
import {
  createCustomerUserSuccess,
  selectCurrentCustomer,
  setCurrentCustomer,
} from 'admin/admin.slice';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import {
  getData,
  getJsonAuthHeaders,
  JSON_HEADERS,
  sendData,
} from 'utils/http';
import { FIELD_NAMES } from 'utils/validators';
import {
  REGISTER_CUSTOMER,
  REGISTER_CUSTOMER_ORDER,
  RESEND,
} from './accounts.constants';
import { userSelector } from './accounts.selectors';

const API_PREFIX = '/api/authentication/';
const API = {
  registerUser: API_PREFIX + 'registration/',
  registerCustomer: '/api/customers/',
  activate: API_PREFIX + 'registration/verify-email/',
  resendVerificationEmail: API_PREFIX + 'send-email-verification/',
  login: API_PREFIX + 'login/',
  changePassword: API_PREFIX + 'password/change/',
  resetPassword: API_PREFIX + 'password/reset/',
  verifyResetPassword: API_PREFIX + 'password/verify-reset/',
  logout: API_PREFIX + 'logout/',
  user: '/api/users/',
};
const FIELD_MAPPING = {
  registerUser: {
    [FIELD_NAMES.email]: 'email',
    [FIELD_NAMES.newPassword]: 'password1',
    [FIELD_NAMES.newPasswordConfirm]: 'password2',
    [FIELD_NAMES.acceptedTerms]: 'accepted_terms',
  },
  registerCustomer: {
    [FIELD_NAMES.customerName]: 'name',
    [FIELD_NAMES.customerNameOfficial]: 'official_name',
    [FIELD_NAMES.customerType]: 'company_type',
    [FIELD_NAMES.registeredNumber]: 'registered_id',
  },
  placeOrder: {
    paymentType: 'order_type',
    amount: 'cost',
    licences: 'n_licences',
    period: 'subscription_period',
  },
  changePassword: {
    [FIELD_NAMES.newPassword]: 'new_password1',
    [FIELD_NAMES.newPasswordConfirm]: 'new_password2',
  },
  confirmResetPassword: {
    [FIELD_NAMES.newPassword]: 'new_password1',
    [FIELD_NAMES.newPasswordConfirm]: 'new_password2',
  },
};

export const status = {
  NONE: 'None',
  PENDING: 'Pending',
  COMPLETE: 'Complete',
};

/**
 * @param {object} data
 * @param {object} mapping
 * @returns {object}
 */
const mapData = (data, mapping) =>
  Object.entries(data).reduce(
    (prev, [key, value]) => ({ ...prev, [mapping[key] || key]: value }),
    {},
  );

// Shape error data into a single array of only error strings.
const errorTransformer = errorObject => {
  if (errorObject.detail || !errorObject.errors) {
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
      state.error = payload.errors;
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
    resendVerificationEmailFailure: (state, payload) => {
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

export const registerUser = form => async dispatch => {
  dispatch(fetchRequested());
  const data = mapData(form, FIELD_MAPPING.registerUser);

  const response = await sendData(API.registerUser, data, JSON_HEADERS);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(registerUserFailure(errorTransformer(errorObject)));
  }
  const user = await response.json();
  dispatch(registerUserSuccess(user));
  return dispatch(push(RESEND));
};

/**
 * This creates a customer but also adds the current user as a CustomerUser
 *
 * @param {import('./register/customer/customer-registration/customer-registration.component').FormValues} form
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const registerCustomer = form => async (dispatch, getState) => {
  dispatch(fetchRequested());
  const headers = getJsonAuthHeaders(getState());
  const data = {
    ...mapData(form, FIELD_MAPPING.registerCustomer),
    type: 'MULTIPLE',
  };
  const createCustomerResponse = await sendData(
    API.registerCustomer,
    data,
    headers,
  );
  if (!createCustomerResponse.ok) {
    const errors = await createCustomerResponse.json();
    return dispatch(registerCustomerFailure(errorTransformer(errors)));
  }
  const customer = await createCustomerResponse.json();
  dispatch(setCurrentCustomer(customer));
  const createCustomerUserResponse = await sendData(
    `/api/customers/${customer.id}/users/`,
    {
      type: 'MANAGER',
      status: 'ACTIVE',
      user: {
        email: form.email,
      },
      licences: [],
    },
    headers,
  );
  if (!createCustomerUserResponse.ok) {
    const errors = await createCustomerUserResponse.json();
    return dispatch(registerCustomerFailure(errorTransformer(errors)));
  }
  const customerUser = await createCustomerUserResponse.json();
  dispatch(createCustomerUserSuccess({ user: customerUser }));
  const getUserRequest = await getData(`${API.user}current/`, headers);
  if (!getUserRequest.ok) {
    const errors = await getUserRequest.json();
    return dispatch(registerCustomerFailure(errorTransformer(errors)));
  }
  const body = await getUserRequest.json();
  dispatch(fetchUserSuccess(body));
  dispatch(registerCustomerSuccess());
  dispatch(push(REGISTER_CUSTOMER_ORDER));
};

/**
 * @param {import('./register/customer/order-form/order-form.component').FormValues} form
 * @returns {import('redux-thunk').ThunkAction<void, any, any, any>}
 */
export const placeOrder = form => async (dispatch, getState) => {
  dispatch(fetchRequested());
  const headers = getJsonAuthHeaders(getState());
  let data = mapData(form, FIELD_MAPPING.placeOrder);
  data = {
    order_type: data.order_type,
    cost: data.cost,
    items: [
      {
        orb: data.subscription,
        n_licences: data.n_licences,
        expiration: data.subscription_period,
      },
    ],
  };
  const currentCustomerId =
    selectCurrentCustomer(getState())?.id ||
    userSelector(getState())?.customers[0]?.id;
  const response = await sendData(
    `/api/customers/${currentCustomerId}/orders/`,
    data,
    headers,
  );
  if (!response.ok) {
    const body = await response.json();
    return dispatch(placeOrderFailure({ errors: errorTransformer(body) }));
  }
  const fetchCustomerResponse = await getData(
    `/api/customers/${currentCustomerId}/`,
    headers,
  );
  if (!fetchCustomerResponse.ok) {
    const errors = await fetchCustomerResponse.json();
    return dispatch(placeOrderFailure({ errors: errorTransformer(errors) }));
  }
  const customer = await fetchCustomerResponse.json();
  dispatch(setCurrentCustomer(customer));
  dispatch(placeOrderSuccess());
  dispatch(push('/'));
};

export const activateAccount = form => async dispatch => {
  dispatch(fetchRequested());
  const response = await sendData(API.activate, form, JSON_HEADERS);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(activateAccountFailure(errorTransformer(errorObject)));
  }
  const { user } = await response.json();
  return dispatch(activateAccountSuccess({ user }));
};

export const fetchUser = (email = 'current') => async (dispatch, getState) => {
  dispatch(fetchRequested());
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
  dispatch(fetchRequested());
  const response = await sendData(API.login, form, JSON_HEADERS);
  if (!response.ok) {
    const responseObject = await response.json();
    if (responseObject.user?.is_verified === false) dispatch(push(RESEND));
    return dispatch(
      loginUserFailure({
        ...responseObject,
        errors: errorTransformer(responseObject),
      }),
    );
  }
  const userKey = (await response.json()).token;
  const headers = getJsonAuthHeaders({ accounts: { userKey } });
  const fetchUserResponse = await getData(`${API.user}current/`, headers);
  if (!fetchUserResponse.ok) {
    const responseObject = await fetchUserResponse.json();
    return dispatch(
      loginUserFailure({
        errors: errorTransformer(responseObject),
      }),
    );
  }
  /** @type {User} */
  const user = await fetchUserResponse.json();
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
};

export const resendVerificationEmail = email => async dispatch => {
  dispatch(fetchRequested());
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
  dispatch(fetchRequested());
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(API.logout, {}, headers);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(logoutUserFailure(errorTransformer(errorObject)));
  }

  return dispatch(logoutUserSuccess());
};

export const changePassword = form => async (dispatch, getState) => {
  const data = mapData(form, FIELD_MAPPING.changePassword);
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(API.changePassword, data, headers);

  if (!response.ok) {
    const errorObject = await response.json();
    return dispatch(changePasswordFailure(errorTransformer(errorObject)));
  }

  return dispatch(changePasswordSuccess());
};

export const confirmResetPassword = (form, params) => async dispatch => {
  const { uid, token } = params;
  const data = {
    ...mapData(form, FIELD_MAPPING.confirmResetPassword),
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

  const { user } = await response.json();
  return dispatch(passwordResetRequestedSuccess(user));
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
  dispatch(fetchRequested());
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

export default persistReducer(persistConfig, accountsSlice.reducer);
