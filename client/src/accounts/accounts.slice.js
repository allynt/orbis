import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';
import { push } from 'redux-first-history';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import apiClient from 'api-client';
import { bookmarksSelector, fetchBookmarks } from 'bookmarks/bookmarks.slice';
import {
  selectCurrentCustomer,
  setCurrentCustomer,
  createCustomerUserSuccess,
} from 'mission-control/mission-control.slice';

import {
  REGISTER_CUSTOMER,
  REGISTER_CUSTOMER_ORDER,
  RESEND_URL,
} from './accounts.constants';
import { userSelector } from './accounts.selectors';

export const status = {
  NONE: 'None',
  PENDING: 'Pending',
  COMPLETE: 'Complete',
};

/**
 * @param {string} actionType
 */
const thunkNameFromActionType = actionType => actionType.match(/\/(\w*)\//)[1];

/**
 * @param {AccountsState} state
 * @param {string} requestName
 * @param {'pending' | 'fulfilled' | 'rejected'} status
 */
const setRequestStatus = (state, requestName, status) => {
  state.requests = { ...state.requests, [requestName]: status };
};

/**
 * @typedef AccountsState
 * @property {string} [userKey]
 * @property {import('typings').User} [user]
 * @property {any} [error]
 * @property {string} resetStatus
 * @property {string} changeStatus
 * @property {Record<string, 'pending' | 'fulfilled' | 'rejected'>} requests
 */

/** @type {AccountsState} */
const initialState = {
  userKey: null,
  user: null,
  error: null,
  resetStatus: status.NONE,
  changeStatus: status.NONE,
  requests: {},
};

const name = 'accounts';

export const registerUser = createAsyncThunk(
  `${name}/registerUser`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  import('typings').PartialUser,
   *  import('./register/customer/user-registration/user-registration.component').FormValues,
   *  {rejectValue: string[]}
   * >}
   */
  async (form, { dispatch, rejectWithValue }) => {
    try {
      const user = await apiClient.authentication.registerUser(form);
      dispatch(push(RESEND_URL));
      return user;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  `${name}/fetchCurrentUser`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  import('typings').User,
   *  void,
   *  {rejectValue: string[], state: import('react-redux').DefaultRootState}
   * >}
   */
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const user = await apiClient.users.getCurrentUser();
      if (!bookmarksSelector(getState())) {
        await dispatch(fetchBookmarks());
      }
      return user;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors);
    }
  },
);

export const registerCustomer = createAsyncThunk(
  `${name}/registerCustomer`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  import('typings').User,
   *  import('./register/customer/customer-registration/customer-registration.component').FormValues,
   *  {rejectValue: string[]}
   * >}
   */
  async (form, { dispatch, rejectWithValue }) => {
    try {
      const customer = await apiClient.customers.createCustomer({
        ...form,
        type: 'MULTIPLE',
      });
      dispatch(setCurrentCustomer(customer));
      const customerUser = await apiClient.customers.createCustomerUser(
        customer.id,
        {
          type: 'MANAGER',
          status: 'ACTIVE',
          user: {
            email: form.email,
          },
          licences: [],
        },
      );
      dispatch(createCustomerUserSuccess({ user: customerUser }));
      const user = await apiClient.users.getCurrentUser();
      dispatch(push(REGISTER_CUSTOMER_ORDER));
      return user;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors);
    }
  },
);

export const placeOrder = createAsyncThunk(
  `${name}/placeOrder`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  void,
   *  {
   *    subscription: string;
   *    paymentType?: string;
   *    amount?: number;
   *    licences: number;
   *    period?: string;
   *  },
   *  {rejectValue: string[], state: import('typings').RootState}
   * >}
   */
  async (form, { dispatch, getState, rejectWithValue }) => {
    const currentCustomerId =
      selectCurrentCustomer(getState())?.id ||
      userSelector(getState())?.customers[0]?.id;
    try {
      await apiClient.customers.placeOrder(currentCustomerId, form);
      const customer = await apiClient.customers.getCustomer(currentCustomerId);
      dispatch(setCurrentCustomer(customer));
      return;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors || [responseError.message]);
    }
  },
);

export const activateAccount = createAsyncThunk(
  `${name}/activateAccount`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  {user: import('typings').User},
   *  {key: string},
   *  {rejectValue: string[], state: import('react-redux').DefaultRootState}
   * >}
   */
  async (form, { rejectWithValue }) => {
    try {
      const { user } = await apiClient.authentication.verifyEmail(form);
      return { user };
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors);
    }
  },
  {
    condition: (_arg, { getState }) => {
      const requestStatus = getState().accounts.requests?.activateAccount;
      return !requestStatus || requestStatus === 'fulfilled';
    },
  },
);

export const login = createAsyncThunk(
  `${name}/login`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  {user: import('typings').User, userKey: string},
   *  {
   *    email: string;
   *    password: string;
   *    accepted_terms?: boolean;
   *  },
   *  {rejectValue: {user: import('typings').PartialUser, errors: string[]}}
   * >}
   */
  async (form, { rejectWithValue, dispatch }) => {
    try {
      const { token: userKey } = await apiClient.authentication.login(form);
      apiClient.userKey = userKey;
      const user = await apiClient.users.getCurrentUser();
      switch (user.registration_stage) {
        case 'CUSTOMER':
        case 'CUSTOMER_USER':
          dispatch(push(REGISTER_CUSTOMER));
          break;
        case 'ORDER':
          dispatch(push(REGISTER_CUSTOMER_ORDER));
          break;
        default:
          dispatch(push('/'));
          break;
      }
      return { userKey, user };
    } catch (error) {
      /** @type {import('api-client').ResponseError<{user?: import('typings').PartialUser}>} */
      const responseError = error;
      const responseBody = await responseError.getBody();
      if (responseBody.user?.is_verified === false) dispatch(push(RESEND_URL));
      const errors = await responseError.getErrors();
      return rejectWithValue({
        user: responseBody.user,
        errors,
      });
    }
  },
);

export const logout = createAsyncThunk(
  `${name}/logout`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  void,
   *  void,
   *  {rejectValue: string[]}
   * >}
   */
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.authentication.logout();
      apiClient.userKey = '';
      return;
    } catch (error) {
      const errors = await /** @type {import('api-client').ResponseError} */ (
        error
      ).getErrors();
      return rejectWithValue(errors);
    }
  },
);

export const resendVerificationEmail = createAsyncThunk(
  `${name}/resendVerificationEmail`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  void,
   *  import('typings').User['email'],
   *  {rejectValue: string[]}
   * >}
   */
  async (email, { rejectWithValue }) => {
    try {
      await apiClient.authentication.sendVerificationEmail({ email });
      return;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors);
    }
  },
);

export const changePassword = createAsyncThunk(
  `${name}/changePassword`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  void,
   *  {newPassword: string, newPasswordConfirm: string},
   *  {rejectValue: string[]}
   * >}
   */
  async (form, { rejectWithValue }) => {
    try {
      await apiClient.authentication.changePassword(form);
      return;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors);
    }
  },
);

export const resetPasswordRequest = createAsyncThunk(
  `${name}/resetPasswordRequest`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  void,
   *  {email: import('typings').User['email']},
   *  {rejectValue: string[]}
   * >}
   */
  async (form, { rejectWithValue }) => {
    try {
      await apiClient.authentication.resetPasswordRequest(form);
      return;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors);
    }
  },
);

export const resetPasswordConfirm = createAsyncThunk(
  `${name}/resetPasswordConfirm`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  import('typings').PartialUser,
   *  {newPassword: string, newPasswordConfirm: string, uid: string, token: string},
   *  {rejectValue: string[]}
   * >}
   */
  async (form, { rejectWithValue }) => {
    try {
      const { user } = await apiClient.authentication.resetPasswordVerify(form);
      return user;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      return rejectWithValue(errors);
    }
  },
);

export const updateUser = createAsyncThunk(
  `${name}/updateUser`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  import('typings').User,
   *  Partial<import('typings').User>,
   *  {rejectValue: string[], state: import('typings').RootState}
   * >}
   */
  async (form, { rejectWithValue, getState }) => {
    const {
      accounts: { user },
    } = getState();

    const userWithUpdates = {
      ...user,
      ...form,
    };

    try {
      const updatedUser = await apiClient.users.updateUser(userWithUpdates);
      NotificationManager.success(
        'Successfully updated user',
        '',
        5000,
        () => {},
      );
      return updatedUser;
    } catch (responseError) {
      const errors = await responseError.getErrors();
      NotificationManager.error('Error updating user', '', 5000, () => {});
      return rejectWithValue(errors);
    }
  },
);

const accountsSlice = createSlice({
  name,
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(placeOrder.fulfilled, state => {
      state.error = null;
      setRequestStatus(state, 'placeOrder', 'fulfilled');
    });
    builder
      .addCase(activateAccount.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.userKey = null;
        state.error = null;
        setRequestStatus(state, 'activateAccount', 'fulfilled');
      })
      .addCase(activateAccount.rejected, (state, { payload }) => {
        state.error = payload;
        state.userKey = null;
        setRequestStatus(state, 'activateAccount', 'rejected');
      });
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.userKey = payload.userKey;
        state.user = payload.user;
        state.error = null;
        setRequestStatus(state, 'login', 'fulfilled');
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.user = payload.user;
        state.userKey = null;
        state.error = payload.errors;
        setRequestStatus(state, 'login', 'rejected');
      });
    builder.addCase(logout.fulfilled, state => {
      state.userKey = null;
      state.user = null;
      state.error = null;
      setRequestStatus(state, 'logout', 'fulfilled');
    });
    builder.addCase(resendVerificationEmail.fulfilled, state => {
      state.error = null;
      setRequestStatus(state, 'resendVerificationEmail', 'fulfilled');
    });
    builder.addCase(changePassword.fulfilled, state => {
      state.changeStatus = status.PENDING;
      state.error = null;
      setRequestStatus(state, 'changePassword', 'fulfilled');
    });
    builder.addCase(resetPasswordRequest.fulfilled, state => {
      state.resetStatus = status.PENDING;
      state.error = null;
      setRequestStatus(state, 'resetPasswordRequest', 'fulfilled');
    });
    builder.addCase(resetPasswordConfirm.fulfilled, (state, { payload }) => {
      state.resetStatus = status.COMPLETE;
      state.user = payload;
      state.error = null;
      setRequestStatus(state, 'resetPasswordConfirm', 'fulfilled');
    });
    builder.addMatcher(
      // @ts-ignore
      action =>
        action.type.startsWith(name) && action.type.endsWith('/pending'),
      (state, action) => {
        setRequestStatus(
          state,
          thunkNameFromActionType(action.type),
          'pending',
        );
        state.error = null;
      },
    );
    builder.addMatcher(
      // @ts-ignore
      action =>
        [registerUser, fetchCurrentUser, registerCustomer, updateUser]
          .map(action => action.fulfilled.type)
          .includes(action.type),
      (state, { payload, type }) => {
        state.user = payload;
        state.error = null;
        setRequestStatus(state, thunkNameFromActionType(type), 'fulfilled');
      },
    );
    builder.addMatcher(
      // @ts-ignore
      action =>
        [
          registerUser,
          fetchCurrentUser,
          registerCustomer,
          placeOrder,
          logout,
          resendVerificationEmail,
          changePassword,
          resetPasswordRequest,
          resetPasswordConfirm,
          updateUser,
        ]
          .map(action => action.rejected.type)
          .includes(action.type),
      (state, { payload, type }) => {
        state.error = payload;
        setRequestStatus(state, thunkNameFromActionType(type), 'rejected');
      },
    );
  },
});

const persistConfig = {
  key: 'accounts',
  whitelist: ['userKey'],
  storage,
};

export const { setUser } = accountsSlice.actions;

export default persistReducer(persistConfig, accountsSlice.reducer);
