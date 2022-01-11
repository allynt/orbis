import { createSlice, createSelector } from '@reduxjs/toolkit';

import {
  createBottomMapStyle,
  createTopMapStyle,
} from 'map-style/mapStyle.utils';
import { styles as mapStyles } from 'map-style/styles';

/**
 * @typedef {{
 *   selectedMapStyle: import('map-style/styles').MapStyleKey
 *   mapStyles: import('map-style/styles').MapStyles
 *   topMapLayerGroups: import('map-style/constants').LayerGroupSlug[]
 *   isCompareMode: boolean
 *   isLoading: boolean
 *   saveMap: boolean
 * }} MapState
 */

/**
 * @type {MapState}
 */
export const initialState = {
  selectedMapStyle: 'dark',
  // @ts-ignore
  mapStyles,
  topMapLayerGroups: ['label'],
  isCompareMode: false,
  saveMap: false,
  isLoading: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    /** @type { import('@reduxjs/toolkit').CaseReducer<
     *   MapState,
     *   import('@reduxjs/toolkit').PayloadAction<
     *     import('map-style/styles').MapStyleKey
     *   >>} */
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

export const { selectMapStyle, toggleCompareMode, saveMap, setIsLoading } =
  mapSlice.actions;

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
