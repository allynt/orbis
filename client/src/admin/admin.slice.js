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
      if (payload.deletedUser) {
        state.customerUsers = state.customerUsers.filter(
          cu => cu.id !== payload.deletedUser.id,
        );
      }

      if (payload.customer) state.currentCustomer = payload.customer;
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
      state.customerUsers = state.customerUsers.map(user =>
        user.id === payload.id ? payload : user,
      );
      state.isLoading = false;
      state.error = null;
    },
    updateCustomerUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    changeUserRoleRequested: state => {
      state.isLoading = true;
    },
    changeUserRoleSuccess: (state, { payload }) => {
      state.customerUsers = state.customerUsers
        .filter(cu => cu.id !== payload.id)
        .push(payload);
      state.isLoading = false;
      state.error = null;
    },
    changeUserRoleFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    createCustomerUserRequested: state => {
      state.isLoading = true;
    },
    createCustomerUserSuccess: (state, { payload }) => {
      if (payload.user)
        state.customerUsers = [...state.customerUsers, payload.user];
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
  changeUserRoleRequested,
  changeUserRoleSuccess,
  changeUserRoleFailure,
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
  NotificationManager.error(
    message,
    `${title} - ${response.statusText}`,
    5000,
    () => {},
  );
  return dispatch(action({ message }));
};

export const fetchCustomer = user => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());
  dispatch(fetchCustomerRequested());

  const customerId = user.customers[0].id;
  const response = await getData(`${API}${customerId}`, headers);

  if (!response.ok)
    return handleFailure(
      response,
      'Fetching Customer Error',
      fetchCustomerFailure,
      dispatch,
    );

  const currentCustomer = await response.json();
  return dispatch(fetchCustomerSuccess(currentCustomer));
};

export const fetchCustomerUsers = customer => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(fetchCustomerUsersRequested());

  const response = await getData(`${API}${customer.id}/users/`, headers);

  if (!response.ok)
    return handleFailure(
      response,
      'Fetching Customer Users Error',
      fetchCustomerUsersFailure,
      dispatch,
    );

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
      orb =>
        currentCustomer.licences.find(
          licence => licence.orb === orb && !licence.customer_user,
        ).id,
    );

  const { email, name } = fields;

  const data = {
    licences,
    user: {
      email,
      name,
    },
  };

  const createUserResponse = await sendData(
    `${API}${currentCustomer.id}/users/`,
    data,
    headers,
  );

  if (!createUserResponse.ok)
    return handleFailure(
      createUserResponse,
      'Creating Customer User Error',
      createCustomerUserFailure,
      dispatch,
    );

  const fetchCustomerResponse = await getData(
    `${API}${currentCustomer.id}`,
    headers,
  );
  if (!fetchCustomerResponse.ok)
    return handleFailure(
      fetchCustomerResponse,
      'Creating Customer User Error',
      createCustomerUserFailure,
      dispatch,
    );

  const [user, customer] = await Promise.all([
    createUserResponse.json(),
    fetchCustomerResponse.json(),
  ]);

  return dispatch(createCustomerUserSuccess({ user, customer }));
};

export const updateCustomerUser = (customer, user) => async (
  dispatch,
  getState,
) => {
  const headers = getJsonAuthHeaders(getState());

  dispatch(updateCustomerUserRequested());

  const response = await sendData(
    `${API}${customer.id}/users/${user.id}`,
    user,
    headers,
    'PUT',
  );

  if (!response.ok)
    return handleFailure(
      response,
      'Updating User',
      updateCustomerUserFailure,
      dispatch,
    );

  const userData = await response.json();

  return dispatch(updateCustomerUserSuccess(userData));
};

export const changeUserRole = user => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());
  const currentCustomer = selectCurrentCustomer(getState());

  const type = user.type === 'MANAGER' ? 'MEMBER' : 'MANAGER';
  const data = { type };

  dispatch(changeUserRoleRequested());

  const changeUserRoleResponse = await sendData(
    `${API}${currentCustomer.id}/users/${user.id}`,
    data,
    headers,
    'PATCH',
  );

  if (!changeUserRoleResponse.ok)
    return handleFailure(
      changeUserRoleResponse,
      'Changing User Role Error',
      changeUserRoleFailure,
      dispatch,
    );

  const editedUser = await changeUserRoleResponse.json();
  return dispatch(dispatch(changeUserRoleSuccess(editedUser)));
};

export const deleteCustomerUser = user => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());
  const currentCustomer = selectCurrentCustomer(getState());
  dispatch(deleteCustomerUserRequested());

  const deleteUserResponse = await sendData(
    `${API}${currentCustomer.id}/users/`,
    user.id,
    headers,
    'DELETE',
  );

  if (!deleteUserResponse.ok)
    return handleFailure(
      deleteUserResponse,
      'Deleting Customer User Error',
      deleteCustomerUserFailure,
      dispatch,
    );

  const fetchCustomerResponse = await getData(
    `${API}${currentCustomer.id}`,
    headers,
  );
  if (!fetchCustomerResponse.ok)
    return handleFailure(
      fetchCustomerResponse,
      'Deleting Customer User Error',
      deleteCustomerUserFailure,
      dispatch,
    );

  const [deletedUser, customer] = await Promise.all([
    deleteUserResponse.json(),
    fetchCustomerResponse.json(),
  ]);

  return dispatch(deleteCustomerUserSuccess({ deletedUser, customer }));
};

/* === Selectors === */
const baseSelector = state => state.admin;
export const selectCurrentCustomer = createSelector(
  baseSelector,
  state => state.currentCustomer,
);
export const selectCustomerUsers = createSelector(
  baseSelector,
  state => state.customerUsers,
);
const selectLicences = createSelector(
  selectCurrentCustomer,
  customer => customer?.licences,
);

export const selectLicenceInformation = createSelector(
  [selectLicences, selectCustomerUsers],
  (licences, users) =>
    users &&
    licences?.reduce((licenceInformation, { orb, customer_user }) => {
      const orbLicenceInformation = licenceInformation[orb];
      const user =
        !!customer_user && users.find(user => user.id === customer_user);
      const isActive = user?.status === USER_STATUS.active;
      const isPending = user?.status === USER_STATUS.pending;
      let purchased, active, pending;
      if (orbLicenceInformation) {
        purchased = orbLicenceInformation.purchased + 1;
        active = orbLicenceInformation.active + isActive;
        pending = orbLicenceInformation.pending + isPending;
      } else {
        purchased = 1;
        active = +isActive;
        pending = +isPending;
      }
      const available = purchased - active - pending;
      const foobar = {
        ...licenceInformation,
        [orb]: { purchased, available, active, pending },
      };
      console.log(Object.keys(foobar).map(orb => foobar[orb].purchased));

      return {
        ...licenceInformation,
        [orb]: { purchased, available, active, pending },
      };
    }, {}),
);

export default adminSlice.reducer;
