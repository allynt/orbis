import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  layers: []
};

const dataLayersSlice = createSlice({
  name: 'layers',
  initialState,
  reducers: {
    addLayers: (state, { payload }) => {
      state.layers = Array.from(new Set([...state.layers, ...payload]));
    },
    removeLayer: (state, { payload }) => {
      state.layers = state.layers.filter(layer => layer.name !== payload.name);
    }
  }
});

export const { addLayers, removeLayer } = dataLayersSlice.actions;

export default dataLayersSlice.reducer;
