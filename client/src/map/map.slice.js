import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  viewport: {
    zoom: 6,
    longitude: -4.84,
    latitude: 54.71,
    pitch: 0,
    bearing: 0,
  },
  mapStyles: [],
  selectedMapStyle: {},
  isCompareMode: false,
  saveMap: false,
  dimensions: {
    width: -1,
    height: -1,
  },
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setViewport: (state, { payload }) => {
      if (payload) {
        state.viewport = payload;
      }
    },
    selectMapStyle: (state, { payload }) => {
      state.selectedMapStyle = payload;
    },
    toggleCompareMode: state => {
      state.isCompareMode = !state.isCompareMode;
    },
    saveMap: state => {
      state.saveMap = !state.saveMap;
    },
  },
});

export const {
  setViewport,
  selectMapStyle,
  toggleCompareMode,
  saveMap,
} = mapSlice.actions;

const baseSelector = state => state?.map;
export const isCompareModeSelector = createSelector(
  baseSelector,
  map => map?.isCompareMode || false,
);

export default mapSlice.reducer;
