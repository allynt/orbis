import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  createBottomMapStyle,
  createTopMapStyle,
} from 'map-style/mapStyle.utils';
import * as mapStyles from 'map-style/styles';

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
  // @ts-ignore
  mapStyles: {
    ...mapStyles,
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
      bottomMapStyle: createBottomMapStyle(
        map.mapStyles[map.selectedMapStyle],
        map.topMapLayerGroups,
      ),
    },
);

export default mapSlice.reducer;
