import { createSlice, createSelector } from '@reduxjs/toolkit';

import {
  createBottomMapStyle,
  createTopMapStyle,
} from 'map-style/mapStyle.utils';

/**
 */
export const initialState = {
  selectedMapStyle: 'dark',
  mapStyles: null,
  topMapLayerGroups: ['label'],
  isCompareMode: false,
  saveMap: false,
  isLoading: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapStyles: (state, { payload }) => {
      state.mapStyles = payload;
    },
    selectMapStyle: (state, { payload }) => {
      state.selectedMapStyle = payload;
    },
    toggleCompareMode: state => {
      state.isCompareMode = !state.isCompareMode;
    },
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    saveMap: state => {
      state.saveMap = !state.saveMap;
    },
  },
});

export const {
  setMapStyles,
  selectMapStyle,
  toggleCompareMode,
  saveMap,
  setIsLoading,
} = mapSlice.actions;

/**
 * @param {import('typings').RootState} state
 */
const baseSelector = state => state?.map;
export const isCompareModeSelector = createSelector(
  baseSelector,
  map => map?.isCompareMode || false,
);

export const isLoadingSelector = createSelector(
  baseSelector,
  state => state?.isLoading,
);

export const mapStylesSelector = createSelector(
  baseSelector,
  map => map?.mapStyles,
);

export const topMapLayerGroupsSelector = createSelector(
  baseSelector,
  map => map?.topMapLayerGroups || [],
);

export const selectedMapStyleIdSelector = createSelector(
  baseSelector,
  map => map?.selectedMapStyle,
);

export const selectedMapStyleSelector = createSelector(
  baseSelector,
  map =>
    map?.selectedMapStyle && {
      id: map.selectedMapStyle,
      apiKey: map.mapStyles[map.selectedMapStyle].api_key,
      topMapStyle: createTopMapStyle(
        map.mapStyles[map.selectedMapStyle].style,
        map.topMapLayerGroups,
      ),
      bottomMapStyle: createBottomMapStyle(
        map.mapStyles[map.selectedMapStyle].style,
        map.topMapLayerGroups,
      ),
    },
);

export default mapSlice.reducer;
