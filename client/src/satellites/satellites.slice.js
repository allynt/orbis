import { createSlice, createSelector } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';

import { getData, sendData, getJsonAuthHeaders } from '../utils/http';

/**
 * @typedef SatellitesState
 * @property {import('typings/satellites').Satellite[]} [satellites]
 * @property {import('typings/satellites').Scene[]} [scenes]
 * @property {import('typings/satellites').Scene} [selectedScene]
 * @property {any} [error]
 * @property {import('typings/satellites').SavedSearch[]} [satelliteSearches]
 * @property {Partial<import('typings/satellites').SavedSearch>} [currentSearchQuery]
 * @property {'TCI'} visualisationId
 */

const API = {
  sources: '/api/satellites/',
  scenes: '/api/satellites/run_query/',
  savedSearches: '/api/satellites/searches/',
};

/**
 * @type {SatellitesState}
 */
const initialState = {
  satellites: null,
  scenes: null,
  selectedScene: null,
  error: null,
  satelliteSearches: null,
  visualisationId: 'TCI',
};

const satellitesSlice = createSlice({
  name: 'satellites',
  initialState,
  reducers: {
    fetchSatellitesSuccess: (state, { payload }) => {
      state.satellites = payload;
      state.error = null;
    },
    fetchSatellitesFailure: (state, { payload }) => {
      state.error = payload;
    },
    fetchSatelliteScenesSuccess: (state, { payload }) => {
      state.scenes = payload;
      state.error = null;
    },
    fetchSatelliteScenesFailure: (state, { payload }) => {
      state.error = payload;
    },
    selectScene: (state, { payload }) => {
      state.selectedScene = payload;
    },
    removeScenes: state => {
      state.selectedScene = null;
    },
    setCurrentSatelliteSearchQuery: (state, { payload }) => {
      state.currentSearchQuery = payload;
    },
    setCurrentVisualisation: (state, { payload }) => {
      state.visualisationId = payload;
    },
  },
});

export const {
  fetchSatellitesSuccess,
  fetchSatellitesFailure,
  fetchSatelliteScenesSuccess,
  fetchSatelliteScenesFailure,
  selectScene,
  removeScenes,
  setCurrentSatelliteSearchQuery,
  setCurrentVisualisation,
} = satellitesSlice.actions;

export const fetchSatellites = () => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await getData(`${apiClient.apiHost}${API.sources}`, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Fetching Satellites Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(fetchSatellitesFailure({ message }));
  }

  const satellites = await response.json();

  return dispatch(fetchSatellitesSuccess(satellites));
};

export const fetchSatelliteScenes = query => async (dispatch, getState) => {
  dispatch(removeScenes());

  const headers = getJsonAuthHeaders(getState());

  // satellite selection is hard-coded for now
  const response = await sendData(
    `${apiClient.apiHost}${API.scenes}`,
    { tiers: ['free'], ...query },
    headers,
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Fetching Satellite Scenes Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(fetchSatelliteScenesFailure({ message }));
  }

  const scenes = await response.json();

  return dispatch(fetchSatelliteScenesSuccess(scenes));
};

/**
 * @param {import('react-redux').DefaultRootState} state
 */
const baseSelector = state => state?.satellites;

export const selectedPinnedScenesSelector = createSelector(
  baseSelector,
  satellites => satellites?.selectedPinnedScenes || [],
);

export const satellitesSelector = createSelector(
  baseSelector,
  state => state?.satellites,
);

export const scenesSelector = createSelector(
  baseSelector,
  state => state?.scenes,
);

export const selectedSceneSelector = createSelector(
  baseSelector,
  state => state?.selectedScene,
);

export const pinnedScenesSelector = createSelector(
  baseSelector,
  state => state?.pinnedScenes,
);

export const currentSearchQuerySelector = createSelector(
  baseSelector,
  state => state?.currentSearchQuery,
);

export const visualisationIdSelector = createSelector(
  baseSelector,
  state => state?.visualisationId,
);

export const savedSearchesSelector = createSelector(
  baseSelector,
  state => state?.satelliteSearches,
);

export default satellitesSlice.reducer;
