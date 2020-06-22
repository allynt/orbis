import { NotificationManager } from 'react-notifications';
import { createSlice } from '@reduxjs/toolkit';

import { getData, sendData, getJsonAuthHeaders } from 'utils/http';

const API = '/api/customers/';

const initialState = {
  currentCustomer: null,
  customerUsers: null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
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
      state.customerUsers = [...state.customerUsers, payload];
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
} = usersSlice.actions;

export const fetchCustomer = user => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(fetchCustomerRequested());

  const customerName = user.customers[0].name;
  const response = await getData(`${API}${customerName}`, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Customer Error - ${response.statusText}`, 5000, () => {});
    return dispatch(fetchCustomerFailure({ message: 'message' }));
  }

  const currentCustomer = await response.json();
  return dispatch(fetchCustomerSuccess(currentCustomer));
};

export const createCustomerUser = (customer, fields) => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(createCustomerUserRequested());

  const data = {
    status: 'PENDING',
    type: 'MEMBER',
    user: {
      ...fields,
      agreed_terms: true,
    },
  };
  const response = await sendData(`${API}${customer.name}/users/`, data, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Creating Customer User Error - ${response.statusText}`, 5000, () => {});
    return dispatch(createCustomerUserFailure({ message }));
  }

  const user = await response.json();

  return dispatch(createCustomerUserSuccess(user));
};

export const fetchCustomerUsers = customer => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(fetchCustomerUsersRequested());

  const response = await getData(`${API}${customer.name}/users/`, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Customer Users Error - ${response.statusText}`, 5000, () => {});

    return dispatch(fetchCustomerUsersFailure({ message }));
  }

  const users = await response.json();
  return dispatch(fetchCustomerUsersSuccess(users));
};

export const updateCustomerUser = (customer, user) => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(updateCustomerUserRequested());

  const response = await sendData(`${API}${customer.name}/users/${user.id}`, user, headers, 'PUT');

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Updating User', 5000, () => {});

    return dispatch(updateCustomerUserFailure({ message }));
  }

  const userData = await response.json();

  return dispatch(updateCustomerUserSuccess(userData));
};

export const deleteCustomerUser = (customer, user) => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(deleteCustomerUserRequested());

  const response = await sendData(`${API}${customer.name}/users/${user.id}`, null, headers, 'DELETE');

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Deleting User', 5000, () => {});

    return dispatch(deleteCustomerUserFailure({ message }));
  }

  return dispatch(deleteCustomerUserSuccess(user));
};

export const copyCustomerUser = (customer, user) => async dispatch => {
  // Update User to prepend 'Copy of' text.
  const data = {
    ...user,
    email: `UPDATE-${user.email}`,
    username: `UPDATE-${user.email}`,
    name: `Copy of ${user.name}`,
    description: `Copy of ${user.description}`,
  };

  return dispatch(createCustomerUser(customer, data));
};

export default usersSlice.reducer;
