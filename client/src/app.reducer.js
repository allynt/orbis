import { FETCH_APP_CONFIG, NOT_YET_IMPLEMENTED } from './app.actions';

const initialState = {
  config: null,
  notYetImplementedDescription: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APP_CONFIG:
      return { ...state, config: action.config };

    case NOT_YET_IMPLEMENTED:
      return { ...state, notYetImplementedDescription: action.text };

    default:
      return state;
  }
};

export default reducer;
