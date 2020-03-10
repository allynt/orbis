import { NotificationManager } from 'react-notifications';

import ReactGA from 'react-ga';

import { getData, JSON_HEADERS } from '../utils/http';

export const SET_VIEWPORT = 'SET_VIEWPORT';

export const SAVE_MAP = 'SAVE_MAP';

export const MAP_STYLE_SELECTED = 'MAP_STYLE_SELECTED';

export const TOGGLE_MULTI_MODE = 'map.TOGGLE_MULTI_MODE';
export const TOGGLE_3D_MODE = 'map.TOGGLE_3D_MODE';
export const TOGGLE_MINI_MAP = 'map.TOGGLE_MINI_MAP';
export const TOGGLE_SPYGLASS = 'map.TOGGLE_SPYGLASS';
export const TOGGLE_COMPARE = 'map.TOGGLE_COMPARE';

export const TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY = 'map.TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY';
export const TOGGLE_CUSTOM_LAYER_VISIBILITY = 'map.TOGGLE_CUSTOM_LAYER_VISIBILITY';

export const CUSTOM_DATA_REQUESTED_SUCCESS = 'CUSTOM_DATA_REQUESTED_SUCCESS';
export const CUSTOM_DATA_REQUESTED_FAILURE = 'CUSTOM_DATA_REQUESTED_FAILURE';

export const SOURCE_DATA_AND_TOKEN_REQUESTED_SUCCESS = 'SOURCE_DATA_AND_TOKEN_REQUESTED_SUCCESS';
export const SOURCE_DATA_AND_TOKEN_REQUESTED_FAILURE = 'SOURCE_DATA_AND_TOKEN_REQUESTED_FAILURE';

export const INFRASTRUCTURE_DATA_REQUESTED_SUCCESS = 'INFRASTRUCTURE_DATA_REQUESTED_SUCCESS';
export const INFRASTRUCTURE_DATA_REQUESTED_FAILURE = 'INFRASTRUCTURE_DATA_REQUESTED_FAILURE';

export const selectMapStyle = mapStyle => dispatch => dispatch({ type: MAP_STYLE_SELECTED, mapStyle });

export const toggleMultiMode = () => async (dispatch, getState) => {
  ReactGA.event({
    category: 'Multi-Map',
    action: 'View',
    label: '' + !getState().map.isCompareMode
  });

  return dispatch({ type: TOGGLE_MULTI_MODE });
};

export const toggle3DMode = () => async (dispatch, getState) => {
  ReactGA.event({
    category: 'Toolbar',
    action: 'Toggle 3D',
    label: '' + !getState().map.is3D
  });

  return dispatch({ type: TOGGLE_3D_MODE });
};

export const fetchInfrastructureData = () => async dispatch => {
  // POST request model form to API.
  const response = await fetch('/api/layers?key=data/processed/infrastructure', {
    credentials: 'include'
  });
  const infrastructureData = await response.json();

  if (response.ok) {
    return dispatch({
      type: INFRASTRUCTURE_DATA_REQUESTED_SUCCESS,
      layers: infrastructureData
    });
  } else {
    const message = `${response.status} ${response.statusText} - ${infrastructureData.message}`;
    // NotificationManager.error(message, 'Fetching Infrastructure Data', 50000, () => {});
    return dispatch({
      type: INFRASTRUCTURE_DATA_REQUESTED_FAILURE,
      error: infrastructureData
    });
  }
};

export const fetchCustomData = () => async dispatch => {
  // POST request model form to API.
  const response = await fetch('/api/layers?key=data/processed/custom', {
    credentials: 'include'
  });
  const customData = await response.json();

  if (response.ok) {
    return dispatch({
      type: CUSTOM_DATA_REQUESTED_SUCCESS,
      layers: customData
    });
  } else {
    const message = `${response.status} ${response.statusText} - ${customData.message}`;
    // NotificationManager.error(message, 'Fetching Custom Data', 50000, () => {});
    return dispatch({
      type: CUSTOM_DATA_REQUESTED_FAILURE,
      error: message
    });
  }
};

export const saveMap = () => ({ type: SAVE_MAP });

export const setViewport = viewport => ({ type: SET_VIEWPORT, viewport });

export const toggleMiniMap = () => dispatch => dispatch({ type: TOGGLE_MINI_MAP });

export const toggleSpyglassMap = () => dispatch => dispatch({ type: TOGGLE_SPYGLASS });

export const toggleCompareMaps = () => dispatch => dispatch({ type: TOGGLE_COMPARE });

export const fetchSourcesAndDataToken = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: 'Token ' + userKey
  };

  const response = await getData('/api/data/sources/', headers);

  const data = await response.json();

  if (response.ok) {
    return dispatch({
      type: SOURCE_DATA_AND_TOKEN_REQUESTED_SUCCESS,
      sourcesAndToken: data
    });
  } else {
    const message = `${response.status} ${response.statusText} - ${data.message}`;
    // NotificationManager.error(message, 'Fetching Source Data', 50000, () => {});
    return dispatch({
      type: SOURCE_DATA_AND_TOKEN_REQUESTED_FAILURE,
      error: message
    });
  }
};
