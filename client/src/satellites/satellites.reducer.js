import {
  FETCH_SATELLITES_SUCCESS,
  FETCH_SATELLITES_FAILURE,
  FETCH_SATELLITE_SCENES_SUCCESS,
  FETCH_SATELLITE_SCENES_FAILURE,
  SELECT_SCENE,
  REMOVE_SCENES,
  FETCH_VISUALISATIONS_SUCCESS,
  FETCH_VISUALISATIONS_FAILURE
} from './satellites.actions';

const initialState = {
  satellites: null,
  scenes: null,
  selectedScene: null,
  error: null,
  visualisations: null
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

    case FETCH_VISUALISATIONS_SUCCESS:
      return {
        ...state,
        visualisations: action.visualisations,
        error: null
      };

    case FETCH_VISUALISATIONS_FAILURE:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default reducer;
