import { ADD_LAYERS, REMOVE_LAYER } from './data-layers-dialog.actions';

const initialState = {
  layers: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LAYERS:
      return { ...state, layers: Array.from(new Set([...state.layers, ...action.layers])) };

    case REMOVE_LAYER:
      return { ...state, layers: state.layers.filter(layer => layer.name !== action.layer.name) };

    default:
      return state;
  }
};

export default reducer;
