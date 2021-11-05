import { createSelector, createSlice, current } from '@reduxjs/toolkit';
import { pick } from 'lodash';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';
import { getJsonAuthHeaders } from 'utils/http';

export const DEFAULT_MAP_STYLE = 3;

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

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appConfigSuccess: (state, { payload }) => {
      state.config = payload;
      state.error = null;
    },
    appConfigFailure: (state, { payload }) => {
      state.error = payload;
    },
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
});

export const {
  appConfigSuccess,
  appConfigFailure,
  addLogItem,
  removeLogItems,
  setBackgroundLocation,
} = appSlice.actions;

export const fetchAppConfig = () => async dispatch => {
  try {
    const config = await apiClient.app.getConfig();
    return dispatch(appConfigSuccess(config));
  } catch (error) {
    const { message, status } = error;
    NotificationManager.error(
      `${status} ${message}`,
      `Fetching App Config Error - ${message}`,
      50000,
      () => {},
    );
    return dispatch(appConfigFailure({ message: `${status} ${message}` }));
  }
};

export const logUserTracking = () => async (dispatch, getState) => {
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
