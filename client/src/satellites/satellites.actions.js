import { NotificationManager } from 'react-notifications';
import { getData, JSON_HEADERS } from '../utils/http';

export const FETCH_SATELLITES_SUCCESS = 'FETCH_SATELLITES_SUCCESS';
export const FETCH_SATELLITES_FAILURE = 'FETCH_SATELLITES_FAILURE';

export const FETCH_SATELLITE_SCENES_SUCCESS = 'FETCH_SATELLITE_SCENES_SUCCESS';
export const FETCH_SATELLITE_SCENES_FAILURE = 'FETCH_SATELLITE_SCENES_FAILURE';

export const SELECT_SCENE = 'SELECT_SCENE';
export const REMOVE_SCENES = 'REMOVE_SCENES';

export const FETCH_VISUALISATIONS_SUCCESS = 'FETCH_VISUALISATIONS_SUCCESS';
export const FETCH_VISUALISATIONS_FAILURE = 'FETCH_VISUALISATIONS_FAILURE';

const API = {
  sources: '/api/satellites/',
  scenes: '/api/satellites/scenes/',
  visualisations: '/api/satellites/visualisations/'
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
  dispatch(fetchSatelliteScenes());

export const selectScene = scene => ({ type: SELECT_SCENE, scene });

export const removeScenes = () => ({ type: REMOVE_SCENES });

export const fetchVisualisations = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await getData(API.visualisations, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Fetching Satellite Visualisations Error - ${response.statusText}`,
      50000,
      () => {}
    );

    return dispatch({
      type: FETCH_VISUALISATIONS_FAILURE,
      error: { message }
    });
  }

  const visualisations = await response.json();

  return dispatch({
    type: FETCH_VISUALISATIONS_SUCCESS,
    visualisations
  });
};
