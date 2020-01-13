import { ADD_LAYERS } from './data-layers-dialog.actions';

const initialState = {
  layers: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LAYERS:
      return { ...state, layers: action.layers };

    default:
      return state;
  }
};

export default reducer;
