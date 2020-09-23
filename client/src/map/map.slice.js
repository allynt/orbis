import { createSlice, createSelector } from '@reduxjs/toolkit';
import { createTopMapStyle } from 'mapstyle/mapStyle.utils';
import { satellite } from 'mapstyle/styles';

export const initialState = {
  selectedMapStyle: 'satellite',
  mapStyles: {
    satellite,
  },
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

export const { selectMapStyle, toggleCompareMode, saveMap } = mapSlice.actions;

const baseSelector = state => state?.map;
export const isCompareModeSelector = createSelector(
  baseSelector,
  map => map?.isCompareMode || false,
);
export const selectedMapStyleSelector = createSelector(
  baseSelector,
  map =>
    map?.selectedMapStyle && {
      topMapStyle: createTopMapStyle(map?.mapStyles[map?.selectedMapStyle]),
      bottomMapStyle: map?.mapStyles[map?.selectedMapStyle],
    },
);

export default mapSlice.reducer;
