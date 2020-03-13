import {
  FETCH_SATELLITES_SUCCESS,
  FETCH_SATELLITES_FAILURE,
  FETCH_SATELLITE_SCENES_SUCCESS,
  FETCH_SATELLITE_SCENES_FAILURE,
  SELECT_SCENE,
  REMOVE_SCENES,
  FETCH_SATELLITE_SEARCHES_SUCCESS,
  FETCH_SATELLITE_SEARCHES_FAILURE,
  SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS,
  SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE,
  DELETE_SATELLITE_SEARCH_SUCCESS,
  DELETE_SATELLITE_SEARCH_FAILURE,
  SELECT_SATELLITE_SEARCH_QUERY,
  SET_CURRENT_SATELLITE_SEARCH_QUERY,
  FETCH_PINNED_SCENES_SUCCESS,
  FETCH_PINNED_SCENES_FAILURE,
  PIN_SCENE_SUCCESS,
  PIN_SCENE_FAILURE,
  SELECT_PINNED_SCENE,
  CLEAR_SELECTED_PINNED_SCENES,
  DELETE_PINNED_SCENE_SUCCESS,
  DELETE_PINNED_SCENE_FAILURE
} from './satellites.actions';

const initialState = {
  satellites: null,
  scenes: null,
  selectedScene: null,
  error: null,
  satelliteSearches: null,
  selectedSatelliteSearch: null,
  pinnedScenes: null,
  selectedPinnedScenes: [],
  currentSearchQuery: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SATELLITES_SUCCESS:
      return {
        ...state,
        satellites: action.satellites,
        error: null
      };

    case FETCH_SATELLITES_FAILURE:
      return { ...state, error: action.error };

    case FETCH_SATELLITE_SCENES_SUCCESS:
      return {
        ...state,
        scenes: action.scenes,
        error: null
      };

    case FETCH_SATELLITE_SCENES_FAILURE:
      return { ...state, error: action.error };

    case SELECT_SCENE:
      return { ...state, selectedScene: action.scene };

    case REMOVE_SCENES:
      return {
        ...state,
        selectedScene: null
      };

    case FETCH_SATELLITE_SEARCHES_SUCCESS:
      return {
        ...state,
        satelliteSearches: action.searches,
        error: null
      };

    case FETCH_SATELLITE_SEARCHES_FAILURE:
      return { ...state, error: action.error };

    case SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS:
      return {
        ...state,
        satelliteSearches: [...state.satelliteSearches, action.savedSearch],
        error: null
      };

    case SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case DELETE_SATELLITE_SEARCH_SUCCESS:
      return {
        ...state,
        satelliteSearches: action.searches,
        error: null
      };

    case DELETE_SATELLITE_SEARCH_FAILURE:
      return { ...state, error: action.error };

    case SELECT_SATELLITE_SEARCH_QUERY:
      return {
        ...state,
        selectedSatelliteSearch: action.search
      };

    case FETCH_PINNED_SCENES_SUCCESS:
      return {
        ...state,
        pinnedScenes: action.scenes,
        error: null
      };

    case FETCH_PINNED_SCENES_FAILURE:
      return { ...state, error: action.error };

    case PIN_SCENE_SUCCESS:
      return {
        ...state,
        pinnedScenes: action.scenes,
        error: null
      };

    case PIN_SCENE_FAILURE:
      return { ...state, error: action.error };

    case DELETE_PINNED_SCENE_SUCCESS:
      return {
        ...state,
        pinnedScenes: action.scenes,
        error: null
      };

    case DELETE_PINNED_SCENE_FAILURE:
      return { ...state, error: action.error };

    case SELECT_PINNED_SCENE:
      return {
        ...state,
        selectedPinnedScenes: [...state.selectedPinnedScenes, action.scene]
      };

    case CLEAR_SELECTED_PINNED_SCENES:
      return {
        ...state,
        selectedPinnedScenes: []
      };

    case SET_CURRENT_SATELLITE_SEARCH_QUERY:
      return { ...state, currentSearchQuery: action.query };

    default:
      return state;
  }
};

export default reducer;
