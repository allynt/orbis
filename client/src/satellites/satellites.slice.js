import { NotificationManager } from 'react-notifications';

import { createSlice, createSelector } from '@reduxjs/toolkit';

import apiClient from 'api-client';
import { getData, sendData, getJsonAuthHeaders } from '../utils/http';

const API = {
  sources: '/api/satellites/',
  scenes: '/api/satellites/run_query/',
  savedSearches: '/api/satellites/searches/',
  pinScene: '/api/satellites/results/',
};

const initialState = {
  satellites: null,
  scenes: null,
  selectedScene: null,
  error: null,
  satelliteSearches: null,
  pinnedScenes: null,
  selectedPinnedScenes: [],
  currentSearchQuery: null,
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
    fetchSatellitesSearchesSuccess: (state, { payload }) => {
      state.satelliteSearches = payload;
      state.error = null;
    },
    fetchSatellitesSearchesFailure: (state, { payload }) => {
      state.error = payload;
    },
    saveSatelliteSearchSuccess: (state, { payload }) => {
      state.satelliteSearches = [...state.satelliteSearches, payload];
      state.error = null;
    },
    saveSatelliteSearchFailure: (state, { payload }) => {
      state.error = payload;
    },
    deleteSatelliteSearchSuccess: (state, { payload }) => {
      state.satelliteSearches = state.satelliteSearches.filter(
        search => search.id !== payload,
      );
      state.error = null;
    },
    deleteSatelliteSearchFailure: (state, { payload }) => {
      state.error = payload;
    },
    fetchPinnedScenesSuccess: (state, { payload }) => {
      state.pinnedScenes = payload;
      state.error = null;
    },
    fetchPinnedScenesFailure: (state, { payload }) => {
      state.error = payload;
    },
    pinSceneSuccess: (state, { payload }) => {
      state.pinnedScenes = [...state.pinnedScenes, payload];
    },
    pinSceneFailure: (state, { payload }) => {
      state.error = payload;
    },
    deletePinnedSceneSuccess: (state, { payload }) => {
      state.pinnedScenes = state.pinnedScenes.filter(
        scene => scene.id !== payload,
      );
    },
    deletePinnedSceneFailure: (state, { payload }) => {
      state.error = payload;
    },
    selectPinnedScene: (state, { payload }) => {
      state.selectedPinnedScenes = [...state.selectedPinnedScenes, payload];
    },
    deselectPinnedScene: (state, { payload }) => {
      const filteredScenes = state.selectedPinnedScenes.filter(
        scene => scene.id !== payload.id,
      );
      state.selectedPinnedScenes = filteredScenes;
    },
    clearSelectedPinnedScenes: state => {
      state.selectedPinnedScenes = [];
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
  fetchSatellitesSearchesSuccess,
  fetchSatellitesSearchesFailure,
  saveSatelliteSearchSuccess,
  saveSatelliteSearchFailure,
  deleteSatelliteSearchSuccess,
  deleteSatelliteSearchFailure,
  fetchPinnedScenesSuccess,
  fetchPinnedScenesFailure,
  pinSceneSuccess,
  pinSceneFailure,
  deletePinnedSceneSuccess,
  deletePinnedSceneFailure,
  selectPinnedScene,
  deselectPinnedScene,
  clearSelectedPinnedScenes,
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
    query,
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

export const fetchSavedSatelliteSearches = () => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  // satellite selection is hard-coded for now
  const response = await getData(
    `${apiClient.apiHost}${API.savedSearches}`,
    headers,
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Fetching Satellite Searches Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(fetchSatellitesSearchesFailure({ message }));
  }

  const searches = await response.json();

  return dispatch(fetchSatellitesSearchesSuccess(searches));
};

export const deleteSavedSatelliteSearch = id => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(
    `${apiClient.apiHost}${API.savedSearches}`,
    id,
    headers,
    'DELETE',
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Deleting Satellite Search Error - ${response.statusText}`,
      5000,
      () => {},
    );

    return dispatch(deleteSatelliteSearchFailure({ message }));
  }

  return dispatch(deleteSatelliteSearchSuccess(id));
};

export const saveSatelliteSearch = form => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(
    `${apiClient.apiHost}${API.savedSearches}`,
    form,
    headers,
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `"Saving Satellite Search Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(saveSatelliteSearchFailure({ message }));
  }

  const savedSearch = await response.json();

  NotificationManager.success(
    'Successfully Saved Satellite Search Query Terms',
    'Successful Saving',
    5000,
    () => {},
  );

  return dispatch(saveSatelliteSearchSuccess(savedSearch));
};

export const fetchPinnedScenes = () => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  // satellite selection is hard-coded for now
  const response = await getData(
    `${apiClient.apiHost}${API.pinScene}`,
    headers,
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Fetching Pinned Scenes Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(fetchPinnedScenesFailure({ message }));
  }

  const scenes = await response.json();

  return dispatch(fetchPinnedScenesSuccess(scenes));
};

export const pinScene = form => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(
    `${apiClient.apiHost}${API.pinScene}`,
    form,
    headers,
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Pinning Scene Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(pinSceneFailure({ message }));
  }

  const scene = await response.json();

  return dispatch(pinSceneSuccess(scene));
};

export const deletePinnedScene = id => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(
    `${apiClient.apiHost}${API.pinScene}`,
    id,
    headers,
    'DELETE',
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      'Deleting Pinned Scene Error',
      5000,
      () => {},
    );
    return dispatch(deletePinnedSceneFailure({ message }));
  }

  return dispatch(deletePinnedSceneSuccess(id));
};

const baseSelector = state => state?.satellites;
export const selectedPinnedScenesSelector = createSelector(
  baseSelector,
  satellites => satellites?.selectedPinnedScenes || [],
);

export default satellitesSlice.reducer;
