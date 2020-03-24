import { NotificationManager } from 'react-notifications';
import { getData, JSON_HEADERS, sendData } from '../utils/http';

export const FETCH_SATELLITES_SUCCESS = 'FETCH_SATELLITES_SUCCESS';
export const FETCH_SATELLITES_FAILURE = 'FETCH_SATELLITES_FAILURE';

export const FETCH_SATELLITE_SCENES_SUCCESS = 'FETCH_SATELLITE_SCENES_SUCCESS';
export const FETCH_SATELLITE_SCENES_FAILURE = 'FETCH_SATELLITE_SCENES_FAILURE';

export const SELECT_SCENE = 'SELECT_SCENE';
export const REMOVE_SCENES = 'REMOVE_SCENES';
export const FETCH_PINNED_SCENES_SUCCESS = 'FETCH_PINNED_SCENES_SUCCESS';
export const FETCH_PINNED_SCENES_FAILURE = 'FETCH_PINNED_SCENES_FAILURE';
export const PIN_SCENE_SUCCESS = 'PIN_SCENE_SUCCESS';
export const PIN_SCENE_FAILURE = 'PIN_SCENE_FAILURE';
export const SELECT_PINNED_SCENE = 'SELECT_PINNED_SCENE';
export const DESELECT_PINNED_SCENE = 'DESELECT_PINNED_SCENE';
export const CLEAR_SELECTED_PINNED_SCENES = 'CLEAR_SELECTED_PINNED_SCENES';
export const DELETE_PINNED_SCENE_SUCCESS = 'DELETE_PINNED_SCENE_SUCCESS';
export const DELETE_PINNED_SCENE_FAILURE = 'DELETE_PINNED_SCENE_FAILURE';

export const FETCH_SATELLITE_SEARCHES_SUCCESS = 'FETCH_SATELLITE_SEARCHES_SUCCESS';
export const FETCH_SATELLITE_SEARCHES_FAILURE = 'FETCH_SATELLITE_SEARCHES_FAILURE';
export const SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS = 'SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS';
export const SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE = 'SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE';
export const DELETE_SATELLITE_SEARCH_SUCCESS = 'DELETE_SATELLITE_SEARCH_SUCCESS';
export const DELETE_SATELLITE_SEARCH_FAILURE = 'DELETE_SATELLITE_SEARCH_FAILURE';
export const SET_CURRENT_SATELLITE_SEARCH_QUERY = 'SET_CURRENT_SATELLITE_SEARCH_QUERY';

const API = {
  sources: '/api/satellites/',
  scenes: '/api/satellites/run_query/',
  savedSearches: '/api/satellites/searches/',
  pinScene: '/api/satellites/results/'
};

export const fetchSatellites = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await getData(API.sources, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Satellites Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: FETCH_SATELLITES_FAILURE,
      error: { message }
    });
  }

  const satellites = await response.json();

  return dispatch({
    type: FETCH_SATELLITES_SUCCESS,
    satellites
  });
};

export const fetchSatelliteScenes = query => async (dispatch, getState) => {
  dispatch({ type: REMOVE_SCENES });
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  // satellite selection is hard-coded for now
  const url = `${API.scenes}`;
  const response = await sendData(url, query, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Satellite Scenes Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: FETCH_SATELLITE_SCENES_FAILURE,
      error: { message }
    });
  }

  const scenes = await response.json();

  return dispatch({
    type: FETCH_SATELLITE_SCENES_SUCCESS,
    scenes
  });
};

export const searchSatellites = query => async dispatch => dispatch(fetchSatelliteScenes(query));

export const selectScene = scene => ({ type: SELECT_SCENE, scene });

export const removeScenes = () => ({ type: REMOVE_SCENES });

export const fetchSavedSatelliteSearches = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  // satellite selection is hard-coded for now
  const response = await getData(API.savedSearches, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Satellite Searches Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: FETCH_SATELLITE_SEARCHES_FAILURE,
      error: { message }
    });
  }

  const searches = await response.json();

  return dispatch({
    type: FETCH_SATELLITE_SEARCHES_SUCCESS,
    searches
  });
};

export const deleteSavedSatelliteSearch = id => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await sendData(API.savedSearches, id, headers, 'DELETE');

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Deleting Satellite Search Error - ${response.statusText}`, 5000, () => {});
    dispatch({ type: DELETE_SATELLITE_SEARCH_FAILURE, error: { message } });
  } else {
    return dispatch({ type: DELETE_SATELLITE_SEARCH_SUCCESS, id });
  }
  // } catch (error) {
  //   return dispatch({ type: DELETE_SATELLITE_SEARCH_FAILURE, error });
  // }
};

export const saveSatelliteSearch = form => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await sendData(API.savedSearches, form, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `"Saving Satellite Search Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE,
      error: { message }
    });
  }

  const savedSearch = await response.json();

  NotificationManager.success('Successfully Saved Satellite Search Query Terms', 'Successful Saving', 5000, () => {});
  dispatch({ type: SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS, savedSearch });
};

export const fetchPinnedScenes = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  // satellite selection is hard-coded for now
  const response = await getData(API.pinScene, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Pinned Scenes Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: FETCH_PINNED_SCENES_FAILURE,
      error: { message }
    });
  }

  const scenes = await response.json();

  return dispatch({
    type: FETCH_PINNED_SCENES_SUCCESS,
    scenes
  });
};

export const pinScene = form => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await sendData(API.pinScene, form, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Pinning Scene Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: PIN_SCENE_FAILURE,
      error: { message }
    });
  }

  const scene = await response.json();

  return dispatch({
    type: PIN_SCENE_SUCCESS,
    scene
  });
};

export const selectPinnedScene = scene => ({
  type: SELECT_PINNED_SCENE,
  scene
});

export const deselectPinnedScene = scene => ({
  type: DESELECT_PINNED_SCENE,
  scene
});

export const clearSelectedPinnedScenes = () => ({
  type: CLEAR_SELECTED_PINNED_SCENES
});

export const deletePinnedScene = id => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await sendData(API.pinScene, id, headers, 'DELETE');

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, 'Deleting Pinned Scene Error', 5000, () => {});
    dispatch({ type: DELETE_PINNED_SCENE_FAILURE, error: { message } });
  } else {
    return dispatch({ type: DELETE_PINNED_SCENE_SUCCESS, id });
  }
};

export const setCurrentSearchQuery = query => ({
  type: SET_CURRENT_SATELLITE_SEARCH_QUERY,
  query
});
