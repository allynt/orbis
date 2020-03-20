import { FETCH_APP_CONFIG_SUCCESS, FETCH_APP_CONFIG_FAILURE, NOT_YET_IMPLEMENTED } from './app.actions';

const initialState = {
  config: {},
  error: null,
  notYetImplementedDescription: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APP_CONFIG_SUCCESS:
      return { ...state, config: action.config, error: null };

    case FETCH_APP_CONFIG_FAILURE:
      return { ...state, error: action.error };

    case NOT_YET_IMPLEMENTED:
      return { ...state, notYetImplementedDescription: action.text };

    default:
      return state;
  }
};

export default reducer;
