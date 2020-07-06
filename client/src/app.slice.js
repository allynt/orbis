import { NotificationManager } from 'react-notifications';

import { createSlice, createSelector } from '@reduxjs/toolkit';

import { selectMapStyle } from './map/map.slice';

export const DEFAULT_MAP_STYLE = 3;

const initialState = {
  config: {},
  error: null,
  notYetImplementedDescription: null,
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
  },
});

export const {
  appConfigSuccess,
  appConfigFailure,
  notYetImplemented,
} = appSlice.actions;

export const fetchAppConfig = () => async dispatch => {
  const response = await fetch('/api/app/config', { credentials: 'include' });

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
  dispatch(appConfigSuccess(config));

  const mapStyles = config.mapStyles;
  return dispatch(selectMapStyle(mapStyles[DEFAULT_MAP_STYLE]));
};

const baseSelector = state => state?.app;
const configSelector = createSelector(baseSelector, app => app?.config);
export const mapboxTokenSelector = createSelector(
  configSelector,
  config => config?.mapbox_token,
);

export default appSlice.reducer;
