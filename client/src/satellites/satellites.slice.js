import { createSlice, createSelector } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';

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

export const fetchSatellites = () => async dispatch => {
  try {
    const satellites = await apiClient.satellites.getSatellites();
    return dispatch(fetchSatellitesSuccess(satellites));
  } catch (error) {
    /** @type {import('api-client').ResponseError} */
    const { message, status } = error;
    NotificationManager.error(
      `${status} ${message}`,
      `Fetching Satellites Error - ${message}`,
      50000,
      () => {},
    );
    return dispatch(
      fetchSatellitesFailure({ message: `${status} ${message}` }),
    );
  }
};

export const fetchSatelliteScenes = query => async dispatch => {
  dispatch(removeScenes());
  try {
    const scenes = await apiClient.satellites.runQuery(query);
    return dispatch(fetchSatelliteScenesSuccess(scenes));
  } catch (error) {
    /** @type {import('api-client').ResponseError} */
    const { message, status } = error;
    NotificationManager.error(
      `${status} ${message}`,
      `Fetching Satellites Error - ${message}`,
      50000,
      () => {},
    );
    return dispatch(
      fetchSatelliteScenesFailure({
        message: `${status} ${message}`,
      }),
    );
  }
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
