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
    updateCustomerRequested: state => {
      state.isLoading = true;
    },
    updateCustomerSuccess: (state, { payload }) => {
      state.currentCustomer = payload;
      state.isLoading = false;
      state.error = null;
    },
    updateCustomerFailure: (state, { payload }) => {
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
      if (payload.updatedCustomerUser) {
        const userIndex = state.customerUsers.findIndex(
          user => user.id === payload.updatedCustomerUser.id,
        );
        state.customerUsers[userIndex] = payload.updatedCustomerUser;
      }

      if (payload.updatedCustomer) {
        state.currentCustomer = payload.updatedCustomer;
      }

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
    inviteCustomerUserRequested: state => {
      state.isLoading = true;
    },
    inviteCustomerUserSuccess: (state, { payload }) => {
      if (payload.invitedCustomerUser) {
        const customerUserIndex = state.customerUsers.findIndex(
          user => user.id === payload.invitedCustomerUser.id,
        );
        state.customerUsers[customerUserIndex] = payload.invitedCustomerUser;
      }
      state.isLoading = false;
      state.error = null;
    },
    inviteCustomerUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
  },
});

export const {
  fetchCustomerRequested,
  fetchCustomerSuccess,
  fetchCustomerFailure,
  updateCustomerRequested,
  updateCustomerSuccess,
  updateCustomerFailure,
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
  inviteCustomerUserRequested,
  inviteCustomerUserSuccess,
  inviteCustomerUserFailure,
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

  const customerId = user.customers.find(
    customer => customer.type === 'MANAGER',
  ).id;
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

export const updateCustomer = newCustomer => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());
  dispatch(updateCustomerRequested());

  const response = await sendData(
    `${API}${newCustomer.id}`,
    newCustomer,
    headers,
    'PUT',
  );

  if (!response.ok)
    return handleFailure(
      response,
      'Updating Customer Error',
      updateCustomerFailure,
      dispatch,
    );

  const updatedCustomer = await response.json();
  return dispatch(updateCustomerSuccess(updatedCustomer));
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

  const licences = fields.licences.map(
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

export const updateCustomerUser = customerUser => async (
  dispatch,
  getState,
) => {
  const headers = getJsonAuthHeaders(getState());
  const currentCustomer = selectCurrentCustomer(getState());

  dispatch(updateCustomerUserRequested());

  const updateCustomerUserResponse = await sendData(
    `${API}${currentCustomer.id}/users/${customerUser.user.id}/`,
    customerUser,
    headers,
    'PUT',
  );

  if (!updateCustomerUserResponse.ok)
    return handleFailure(
      updateCustomerUserResponse,
      'Update Customer User Error',
      updateCustomerUserFailure,
      dispatch,
    );

  const fetchCustomerResponse = await getData(
    `${API}${currentCustomer.id}`,
    headers,
  );
  if (!fetchCustomerResponse.ok)
    return handleFailure(
      fetchCustomerResponse,
      'Update Customer User Error',
      updateCustomerUserFailure,
      dispatch,
    );

  const [updatedCustomerUser, updatedCustomer] = await Promise.all([
    updateCustomerUserResponse.json(),
    fetchCustomerResponse.json(),
  ]);

  return dispatch(
    updateCustomerUserSuccess({ updatedCustomerUser, updatedCustomer }),
  );
};

export const deleteCustomerUser = customerUser => async (
  dispatch,
  getState,
) => {
  const headers = getJsonAuthHeaders(getState());
  const currentCustomer = selectCurrentCustomer(getState());
  dispatch(deleteCustomerUserRequested());

  const deleteUserResponse = await sendData(
    `${API}${currentCustomer.id}/users/`,
    customerUser.user.id,
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

  const customer = await fetchCustomerResponse.json();

  return dispatch(
    deleteCustomerUserSuccess({ deletedUser: customerUser, customer }),
  );
};

export const inviteCustomerUser = customerUser => async (
  dispatch,
  getState,
) => {
  const headers = getJsonAuthHeaders(getState());
  const currentCustomer = selectCurrentCustomer(getState());

  dispatch(inviteCustomerUserRequested());

  const inviteCustomerUserResponse = await sendData(
    `${API}${currentCustomer.id}/users/${customerUser.user.id}/invite/`,
    {},
    headers,
  );

  if (!inviteCustomerUserResponse.ok)
    return handleFailure(
      inviteCustomerUserResponse,
      'Invite Customer User Error',
      inviteCustomerUserFailure,
      dispatch,
    );

  const invitedCustomerUser = await inviteCustomerUserResponse.json();

  return dispatch(inviteCustomerUserSuccess({ invitedCustomerUser }));
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

export const selectActiveUsers = createSelector(
  selectCustomerUsers,
  customerUsers =>
    customerUsers?.filter(user => user.status === USER_STATUS.active),
);

export const selectPendingUsers = createSelector(
  selectCustomerUsers,
  customerUsers =>
    customerUsers?.filter(user => user.status === USER_STATUS.pending),
);

export const selectAvailableLicences = createSelector(
  selectLicences,
  licences => licences?.filter(licence => !licence.customer_user),
);

export const selectOneAdminRemaining = createSelector(
  selectActiveUsers,
  activeUsers =>
    activeUsers?.filter(user => user.type === 'MANAGER').length === 1,
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

      return {
        ...licenceInformation,
        [orb]: { purchased, available, active, pending },
      };
    }, {}),
);

export default adminSlice.reducer;
