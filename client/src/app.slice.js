import { createSelector, createSlice, current } from '@reduxjs/toolkit';
import { pick } from 'lodash';
import { NotificationManager } from 'react-notifications';

import { getJsonAuthHeaders } from 'utils/http';

export const DEFAULT_MAP_STYLE = 3;

const initialState = {
  config: {},
  error: null,
  notYetImplementedDescription: null,
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
    notYetImplemented: (state, { payload }) => {
      state.notYetImplementedDescription = payload;
    },
    addLogItem: (state, { payload }) => {
      state.trackingQueue = [...state.trackingQueue, payload];
    },
    removeLogItems: (state, { payload }) => {
      state.trackingQueue = state.trackingQueue.filter(
        item => !payload.includes(current(item)),
      );
    },
  },
});

export const {
  appConfigSuccess,
  appConfigFailure,
  notYetImplemented,
  addLogItem,
  removeLogItems,
} = appSlice.actions;

export const fetchAppConfig = () => async dispatch => {
  const response = await fetch(
    `${window.orbis.getEnv().REACT_APP_API_HOST}/api/app/config`,
    {
      credentials: 'include',
    },
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Fetching App Config Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(appConfigFailure({ message }));
  }

  const config = await response.json();
  return dispatch(appConfigSuccess(config));
};

export const logUserTracking = () => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());
  const {
    app: { trackingQueue },
  } = getState();
  if (trackingQueue.length > 0) {
    const response = await fetch(`/api/logs/tracking`, {
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

export default appSlice.reducer;
