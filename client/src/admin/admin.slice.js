import { NotificationManager } from 'react-notifications';
import { createSlice, createSelector } from '@reduxjs/toolkit';

import { getData, sendData, getJsonAuthHeaders } from 'utils/http';
import { USER_STATUS } from './admin.constants';

const API = '/api/customers/';

const initialState = {
  currentCustomer: null,
  customerUsers: null,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchCustomerRequested: state => {
      state.isLoading = true;
    },
    fetchCustomerSuccess: (state, { payload }) => {
      state.currentCustomer = payload;
      state.customerUsers = null;
      state.isLoading = false;
      state.error = null;
    },
    fetchCustomerFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    fetchCustomerUsersRequested: state => {
      state.isLoading = true;
    },
    fetchCustomerUsersSuccess: (state, { payload }) => {
      state.customerUsers = payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchCustomerUsersFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    deleteCustomerUserRequested: state => {
      state.isLoading = true;
    },
    deleteCustomerUserSuccess: (state, { payload }) => {
      state.customerUsers = state.customerUsers.filter(user => user.id !== payload.id);
      state.isLoading = false;
      state.error = null;
    },
    deleteCustomerUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    updateCustomerUserRequested: state => {
      state.isLoading = true;
    },
    updateCustomerUserSuccess: (state, { payload }) => {
      state.customerUsers = state.customerUsers.map(user => (user.id === payload.id ? payload : user));
      state.isLoading = false;
      state.error = null;
    },
    updateCustomerUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    createCustomerUserRequested: state => {
      state.isLoading = true;
    },
    createCustomerUserSuccess: (state, { payload }) => {
      if (payload.user) state.customerUsers = [...state.customerUsers, payload.user];
      if (payload.customer) state.currentCustomer = payload.customer;
      state.isLoading = false;
      state.error = null;
    },
    createCustomerUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
  },
});

export const {
  fetchCustomerRequested,
  fetchCustomerSuccess,
  fetchCustomerFailure,
  fetchCustomerUsersRequested,
  fetchCustomerUsersSuccess,
  fetchCustomerUsersFailure,
  deleteCustomerUserRequested,
  deleteCustomerUserSuccess,
  deleteCustomerUserFailure,
  updateCustomerUserRequested,
  updateCustomerUserSuccess,
  updateCustomerUserFailure,
  createCustomerUserRequested,
  createCustomerUserSuccess,
  createCustomerUserFailure,
} = adminSlice.actions;

/* === Thunks === */

/**
 * @param {Response} response
 * @param {string} title
 * @param {ActionCreatorWithPayload} action
 * @param {Dispatch} dispatch
 */
const handleFailure = (response, title, action, dispatch) => {
  const message = `${response.status} ${response.statusText}`;
  NotificationManager.error(message, `${title} - ${response.statusText}`, 5000, () => {});
  return dispatch(action({ message }));
};

export const fetchCustomer = user => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());
  dispatch(fetchCustomerRequested());

  const customerName = user.customers[0].name;
  const response = await getData(`${API}${customerName}`, headers);

  if (!response.ok) return handleFailure(response, 'Fetching Customer Error', fetchCustomerFailure, dispatch);

  const currentCustomer = await response.json();
  return dispatch(fetchCustomerSuccess(currentCustomer));
};

export const fetchCustomerUsers = customer => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(fetchCustomerUsersRequested());

  const response = await getData(`${API}${customer.name}/users/`, headers);

  if (!response.ok)
    return handleFailure(response, 'Fetching Customer Users Error', fetchCustomerUsersFailure, dispatch);

  const users = await response.json();
  return dispatch(fetchCustomerUsersSuccess(users));
};

/**
 * @param {{email: string, name?: string, licences: string[]}} fields
 */
export const createCustomerUser = fields => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());
  const currentCustomer = selectCurrentCustomer(getState());
  dispatch(createCustomerUserRequested());

  const licences =
    fields.licences &&
    fields.licences.map(
      orb => currentCustomer.licences.find(licence => licence.orb === orb && !licence.customer_user).id,
    );

  const { email, name } = fields;

  const data = {
    licences,
    user: {
      email,
      name,
    },
  };

  const createUserResponse = await sendData(`${API}${currentCustomer.name}/users/`, data, headers);

  if (!createUserResponse.ok)
    return handleFailure(createUserResponse, 'Creating Customer User Error', createCustomerUserFailure, dispatch);

  const fetchCustomerResponse = await getData(`${API}${currentCustomer.name}`, headers);
  if (!fetchCustomerResponse.ok)
    return handleFailure(fetchCustomerResponse, 'Creating Customer User Error', createCustomerUserFailure, dispatch);

  const [user, customer] = await Promise.all([createUserResponse.json(), fetchCustomerResponse.json()]);

  return dispatch(createCustomerUserSuccess({ user, customer }));
};

export const updateCustomerUser = (customer, user) => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(updateCustomerUserRequested());

  const response = await sendData(`${API}${customer.name}/users/${user.id}`, user, headers, 'PUT');

  if (!response.ok) return handleFailure(response, 'Updating User', updateCustomerUserFailure, dispatch);

  const userData = await response.json();

  return dispatch(updateCustomerUserSuccess(userData));
};

export const deleteCustomerUser = (customer, user) => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(deleteCustomerUserRequested());

  const response = await sendData(`${API}${customer.name}/users/${user.id}`, null, headers, 'DELETE');

  if (!response.ok) return handleFailure(response, 'Deleting User', deleteCustomerUserFailure, dispatch);

  return dispatch(deleteCustomerUserSuccess(user));
};

/* === Selectors === */
const baseSelector = state => state.admin;
export const selectCurrentCustomer = createSelector(baseSelector, state => state.currentCustomer);
export const selectCustomerUsers = createSelector(baseSelector, state => state.customerUsers);

export const selectLicencesAndAvailability = createSelector(selectCurrentCustomer, customer => {
  if (!customer?.licences || !customer?.licences.length) return [];
  const { licences } = customer;
  const uniqueOrbNameArray = Array.from(
    licences.reduce((acc, cur) => {
      acc.add(cur.orb);
      return acc;
    }, new Set()),
  );
  const orbsAndAvailability = uniqueOrbNameArray.map(orb => {
    const orbLicences = licences.filter(licence => licence.orb === orb);
    const available = orbLicences.some(
      ({ customer_user }) => customer_user === undefined || customer_user === null || customer_user === '',
    );
    return { orb, available };
  });
  return orbsAndAvailability;
});

export const selectNonPendingLicences = createSelector(
  [selectCurrentCustomer, selectCustomerUsers],
  (customer, users) =>
    customer.licences.filter(licence => {
      if (!licence.customer_user) return true;
      const customer_user = users.find(user => licence.customer_user === user.id);
      return customer_user.status !== USER_STATUS.pending;
    }),
);

export default adminSlice.reducer;
