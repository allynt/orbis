import { createSlice, createSelector } from '@reduxjs/toolkit';
import { createTopMapStyle } from 'map-style/mapStyle.utils';
import { satellite } from 'map-style/styles';

/**
 * @typedef {{
 *   selectedMapStyle: import('map-style/styles').MapStyleKey
 *   mapStyles: { [ key: string]: import('mapbox-gl').Style}
 *   topMapLayerGroups: import('map-style/constants').LayerGroupSlug[]
 *   isCompareMode: boolean
 *   saveMap: boolean
 * }} MapState
 */

/**
 * @type {MapState}
 */
export const initialState = {
  selectedMapStyle: 'satellite',
  mapStyles: {
    // @ts-ignore
    satellite,
  },
  topMapLayerGroups: ['label'],
  isCompareMode: false,
  saveMap: false,
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

/**
 * @param {any} state
 * @returns {MapState}
 */
const baseSelector = state => state?.map;
export const isCompareModeSelector = createSelector(
  baseSelector,
  map => map?.isCompareMode || false,
);

export const topMapLayerGroupsSelector = createSelector(
  baseSelector,
  map => map?.topMapLayerGroups || [],
);

export const selectedMapStyleSelector = createSelector(
  baseSelector,
  map =>
    map?.selectedMapStyle && {
      topMapStyle: createTopMapStyle(
        map.mapStyles[map.selectedMapStyle],
        map.topMapLayerGroups,
      ),
      bottomMapStyle: map.mapStyles[map.selectedMapStyle],
    },
);

export default mapSlice.reducer;
