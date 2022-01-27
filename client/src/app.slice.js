import {
  createSelector,
  createSlice,
  current,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { pick } from 'lodash';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';
import { getJsonAuthHeaders } from 'utils/http';

export const DEFAULT_MAP_STYLE = 3;

const name = 'app';

/**
 * @typedef AppState
 * @property {import('typings').AppConfig} config
 * @property {{message: string}} [error]
 * @property {any[]} trackingQueue
 * @property {import('history').Location} [backgroundLocation]
 */

/** @type {AppState} */
const initialState = {
  config: {},
  error: null,
  trackingQueue: [],
};

export const logUserTracking = () => async (dispatch, getState) => {
  // TODO: this was reverted to normal asynch due to issues around proxies/immer ORB-1055
  const headers = getJsonAuthHeaders(getState());
  const {
    app: { trackingQueue },
  } = getState();
  if (trackingQueue.length > 0) {
    const response = await fetch(`${apiClient.apiHost}/api/logs/tracking`, {
      credentials: 'include',
      method: 'POST',
      headers,
      body: JSON.stringify(trackingQueue),
    });

    if (!response.ok) {
      // Leave items in state, so we can retry later.
      return;
    }

    // Remove items from state
    return dispatch(removeLogItems(trackingQueue));
  }
};

export const fetchAppConfig = createAsyncThunk(
  `${name}/fetchAppConfig`,
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.app.getConfig();
    } catch (error) {
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Fetching App Config Error - ${message}`,
        50000,
        () => {},
      );
      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addLogItem: (state, { payload }) => {
      state.trackingQueue = [...state.trackingQueue, payload];
    },
    removeLogItems: (state, { payload }) => {
      state.trackingQueue = state.trackingQueue.filter(
        item => !payload.includes(current(item)),
      );
    },
    setBackgroundLocation: (state, { payload }) => {
      state.backgroundLocation = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAppConfig.fulfilled, (state, { payload }) => {
      state.config = payload;
      state.error = null;
    });
    builder.addCase(fetchAppConfig.rejected, (state, { payload }) => {
      state.error = payload;
    });
  },
});

export const { addLogItem, removeLogItems, setBackgroundLocation } =
  appSlice.actions;

/** @param {import('typings').RootState} state */
const baseSelector = state => state?.app;

export const configSelector = createSelector(baseSelector, app => app?.config);

export const passwordConfigSelector = createSelector(
  configSelector,
  /** @param {{passwordMinLength: number; passwordMaxLength: number; passwordStrength: number}} config */
  config =>
    pick(config, [
      'passwordMinLength',
      'passwordMaxLength',
      'passwordStrength',
    ]),
);

export const mapboxTokenSelector = createSelector(
  configSelector,
  config => config?.mapbox_token,
);

export const userTrackingIntervalSelector = createSelector(
  configSelector,
  config => config?.userTrackingInterval,
);

export const backgroundLocationSelector = createSelector(
  baseSelector,
  state => state?.backgroundLocation,
);

export default appSlice.reducer;
