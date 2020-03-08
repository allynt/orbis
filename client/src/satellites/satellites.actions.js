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

export const FETCH_SATELLITE_SEARCHES_SUCCESS = 'FETCH_SATELLITE_SEARCHES_SUCCESS';
export const FETCH_SATELLITE_SEARCHES_FAILURE = 'FETCH_SATELLITE_SEARCHES_FAILURE';
export const SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS = 'SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS';
export const SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE = 'SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE';
export const DELETE_SATELLITE_SEARCH_SUCCESS = 'DELETE_SATELLITE_SEARCH_SUCCESS';
export const DELETE_SATELLITE_SEARCH_FAILURE = 'DELETE_SATELLITE_SEARCH_FAILURE';
export const SELECT_SATELLITE_SEARCH_QUERY = 'SELECT_SATELLITE_SEARCH_QUERY';
export const SET_CURRENT_SATELLITE_SEARCH_QUERY = 'SET_CURRENT_SATELLITE_SEARCH_QUERY';

const API = {
  sources: '/api/satellites/',
  scenes: '/api/satellites/scenes/',
  savedSearches: '/api/satellites/searches/',
  pinScene: '/api/satellites/scenes/pinned/'
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

export const fetchSatelliteScenes = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  // satellite selection is hard-coded for now
  const url = `${API.scenes}?satellites=sentinel-2`;
  const response = await getData(url, headers);

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

export const searchSatellites = (selectedSatellites, startDate, endDate) => async dispatch =>
  dispatch(fetchSatelliteScenes(selectedSatellites, startDate, endDate));

export const selectScene = scene => ({ type: SELECT_SCENE, scene });

export const removeScenes = () => ({ type: REMOVE_SCENES });

export const fetchSavedSatellites = () => async (dispatch, getState) => {
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
    NotificationManager.error(response.statusText, 'Deleting Satellite Search Error', 5000, () => {});
    dispatch({ type: DELETE_SATELLITE_SEARCH_FAILURE, error: response });
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
    const errorResponse = await response.json();
    const message = `${response.status} ${response.statusText}`;
    // const error = new Error(errorResponseToString(errorResponse));

    NotificationManager.error(message, `"Saving Satellite Search Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE,
      error: message
    });
  }

  const savedSearch = await response.json();

  NotificationManager.success('Successfully Saved Satellite Search Query Terms', 'Successful Saving', 5000, () => {});
  dispatch({ type: SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS, savedSearch });
};

export const selectSearchQuery = search => ({
  type: SELECT_SATELLITE_SEARCH_QUERY,
  search
});

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

export const pinScene = scene => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await sendData(API.pinScene, scene, headers);

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
export const setCurrentSearchQuery = query => ({
  type: SET_CURRENT_SATELLITE_SEARCH_QUERY,
  query
});
