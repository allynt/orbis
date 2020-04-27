import { NotificationManager } from 'react-notifications';
import { createSlice } from '@reduxjs/toolkit';

import { getData, sendData, JSON_HEADERS } from '../../utils/http';

const API = '/api/users/';

const initialState = {
  users: null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersRequested: state => {
      state.isLoading = true;
    },
    fetchUsersSuccess: (state, { payload }) => {
      state.users = payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchUsersFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    deleteUserRequested: state => {
      state.isLoading = true;
    },
    deleteUserSuccess: (state, { payload }) => {
      state.users = state.users.filter(user => user.id !== payload);
      state.isLoading = false;
      state.error = null;
    },
    deleteUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    updateUserRequested: state => {
      state.isLoading = true;
    },
    updateUserSuccess: (state, { payload }) => {
      state.users = state.users.map(user => (user.id === payload.id ? payload : user));
      state.isLoading = false;
      state.error = null;
    },
    updateUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    createUserRequested: state => {
      state.isLoading = true;
    },
    createUserSuccess: (state, { payload }) => {
      state.users = [...state.users, payload];
      state.isLoading = false;
      state.error = null;
    },
    createUserFailure: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
  },
});

export const {
  fetchUsersRequested,
  fetchUsersSuccess,
  fetchUsersFailure,
  deleteUserRequested,
  deleteUserSuccess,
  deleteUserFailure,
  updateUserRequested,
  updateUserSuccess,
  updateUserFailure,
  createUserRequested,
  createUserSuccess,
  createUserFailure,
} = usersSlice.actions;

export const createUser = fields => async (dispatch, getState) => {
  const {
    accounts: { userKey },
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`,
  };

  dispatch(createUserRequested());

  const response = await sendData(API, fields, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Creating User Error - ${response.statusText}`, 5000, () => {});
    return dispatch(createUserFailure({ message }));
  }

  const user = await response.json();

  return dispatch(createUserSuccess(user));
};

export const fetchUsers = () => async (dispatch, getState) => {
  const {
    accounts: { userKey },
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`,
  };

  dispatch(fetchUsersRequested());

  const response = await getData(API, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Fetching Users', 5000, () => {});

    return dispatch(fetchUsersFailure({ message }));
  }

  const users = await response.json();

  return dispatch(fetchUsersSuccess(users));
};

export const updateUser = user => async (dispatch, getState) => {
  const {
    accounts: { userKey },
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`,
  };

  dispatch(updateUserRequested());

  const response = await sendData(`${API}${user.pk}/`, user, headers, 'PUT');

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Updating User', 5000, () => {});

    return dispatch(updateUserFailure({ message }));
  }

  const userData = await response.json();

  return dispatch(updateUserSuccess(userData));
};

export const deleteUser = id => async (dispatch, getState) => {
  const {
    accounts: { userKey },
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`,
  };

  dispatch(deleteUserRequested());

  const response = await sendData(API, id, headers, 'DELETE');

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Deleting User', 5000, () => {});

    return dispatch(deleteUserFailure({ message }));
  }

  return dispatch(deleteUserSuccess(id));
};

export const copyUser = user => async (dispatch, getState) => {
  // Update User to prepend 'Copy of' text.
  const data = {
    ...user,
    name: `Copy of ${user.name}`,
    description: `Copy of ${user.description}`,
  };

  return dispatch(createUser(data));
};

export default usersSlice.reducer;