import { createSlice, createSelector } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import { userSelector } from 'accounts/accounts.selectors';
import { setUser } from 'accounts/accounts.slice';
import apiClient from 'api-client';
import { fetchSources } from 'data-layers/data-layers.slice';

import { USER_STATUS } from './mission-control.constants';

const initialState = {
  isMissionControlDialogVisible: false,
  currentCustomer: null,
  customerUsers: null,
  isLoading: false,
  error: null,
};

const missionControlSlice = createSlice({
  name: 'missionControl',
  initialState,
  reducers: {
    toggleMissionControlDialog: (state, { payload }) => {
      state.isMissionControlDialogVisible = payload;
    },
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
    setCurrentCustomer: (state, { payload }) => {
      state.currentCustomer = payload;
    },
    createCustomerUserRequested: state => {
      state.isLoading = true;
    },
    createCustomerUserSuccess: (state, { payload }) => {
      if (payload.user)
        state.customerUsers = [...(state.customerUsers || []), payload.user];
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
  toggleMissionControlDialog,
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
  setCurrentCustomer,
} = missionControlSlice.actions;

/* === Thunks === */

/**
 * @param {Response} response
 * @param {string} title
 * @param {import('@reduxjs/toolkit').ActionCreatorWithPayload} action
 * @param {import('redux').Dispatch} dispatch
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

export const fetchCustomer = user => async dispatch => {
  dispatch(fetchCustomerRequested());
  const customerId = user.customers[0].id;
  try {
    const currentCustomer = await apiClient.customers.getCustomer(customerId);
    return dispatch(fetchCustomerSuccess(currentCustomer));
  } catch (responseError) {
    return handleFailure(
      responseError.response,
      'Fetching Customer Error',
      fetchCustomerFailure,
      dispatch,
    );
  }
};

export const updateCustomer = newCustomer => async dispatch => {
  dispatch(updateCustomerRequested());
  try {
    const updatedCustomer = await apiClient.customers.updateCustomer(
      newCustomer,
    );
    NotificationManager.success(
      'Successfully updated account',
      '',
      5000,
      () => {},
    );
    return dispatch(updateCustomerSuccess(updatedCustomer));
  } catch (responseError) {
    return handleFailure(
      responseError.response,
      'Updating Customer Error',
      updateCustomerFailure,
      dispatch,
    );
  }
};

export const fetchCustomerUsers = customer => async dispatch => {
  dispatch(fetchCustomerUsersRequested());
  try {
    const users = await apiClient.customers.getCustomerUsers(customer.id);
    return dispatch(fetchCustomerUsersSuccess(users));
  } catch (responseError) {
    return handleFailure(
      responseError.response,
      'Fetching Customer Users Error',
      fetchCustomerUsersFailure,
      dispatch,
    );
  }
};

/**
 * @param {{email: string, name?: string, licences: string[]}} fields
 */
export const createCustomerUser = fields => async (dispatch, getState) => {
  const currentCustomer = selectCurrentCustomer(getState());
  dispatch(createCustomerUserRequested());

  const licences = fields.licences.map(
    orb =>
      currentCustomer.licences.find(
        licence => licence.orb === orb && !licence.customer_user,
      ).id,
  );
  const { email, name } = fields;

  try {
    const user = await apiClient.customers.createCustomerUser(
      currentCustomer.id,
      {
        licences,
        user: {
          email,
          name,
        },
      },
    );
    const customer = await apiClient.customers.getCustomer(currentCustomer.id);
    return dispatch(createCustomerUserSuccess({ user, customer }));
  } catch (responseError) {
    return handleFailure(
      responseError.response,
      'Creating Customer User Error',
      createCustomerUserFailure,
      dispatch,
    );
  }
};

/**
 * @param {import('typings').CustomerUser} customerUser
 */
export const updateCustomerUser =
  customerUser => async (dispatch, getState) => {
    const currentCustomer = selectCurrentCustomer(getState());
    const currentUser = userSelector(getState());

    dispatch(updateCustomerUserRequested());

    try {
      const updatedCustomerUser = await apiClient.customers.updateCustomerUser(
        currentCustomer.id,
        customerUser,
      );
      const updatedCustomer = await apiClient.customers.getCustomer(
        currentCustomer.id,
      );
      if (updatedCustomerUser.user.id === currentUser.id) {
        const updatedUser = await apiClient.users.getCurrentUser();
        dispatch(setUser(updatedUser));
        const hasUpdatedLicences =
          updatedUser.orbs?.length !== currentUser.orbs?.length ||
          updatedUser.orbs?.some(
            updatedOrb =>
              !currentUser.orbs.find(
                currentOrb => currentOrb.name === updatedOrb.name,
              ),
          );
        if (hasUpdatedLicences) {
          dispatch(fetchSources());
        }
      }
      return dispatch(
        updateCustomerUserSuccess({ updatedCustomerUser, updatedCustomer }),
      );
    } catch (responseError) {
      return handleFailure(
        responseError.response,
        'Update Customer User Error',
        updateCustomerUserFailure,
        dispatch,
      );
    }
  };

export const deleteCustomerUser =
  customerUser => async (dispatch, getState) => {
    dispatch(deleteCustomerUserRequested());
    const currentCustomer = selectCurrentCustomer(getState());
    try {
      await apiClient.customers.deleteCustomerUser(
        currentCustomer.id,
        customerUser.user.id,
      );
      const customer = await apiClient.customers.getCustomer(
        currentCustomer.id,
      );
      return dispatch(
        deleteCustomerUserSuccess({ deletedUser: customerUser, customer }),
      );
    } catch (responseError) {
      return handleFailure(
        responseError.response,
        'Deleting Customer User Error',
        deleteCustomerUserFailure,
        dispatch,
      );
    }
  };

export const inviteCustomerUser =
  customerUser => async (dispatch, getState) => {
    dispatch(inviteCustomerUserRequested());
    const currentCustomer = selectCurrentCustomer(getState());
    try {
      const invitedCustomerUser = await apiClient.customers.inviteCustomerUser(
        currentCustomer.id,
        customerUser,
      );
      return dispatch(inviteCustomerUserSuccess({ invitedCustomerUser }));
    } catch (responseError) {
      return handleFailure(
        responseError.response,
        'Invite Customer User Error',
        inviteCustomerUserFailure,
        dispatch,
      );
    }
  };

/* === Selectors === */
const baseSelector = state => state.missionControl || {};
export const selectIsMissionControlDialogVisible = createSelector(
  baseSelector,
  ({ isMissionControlDialogVisible }) => isMissionControlDialogVisible,
);

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

export default missionControlSlice.reducer;
