/**
 * @typedef {import('typings').GeoJsonFeature} GeoJsonFeature
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';

export const SHARED_STATE_KEY = 'shared';

/**
 * @typedef {{
 *   crossFilteringLayerData: string[]
 *   crossFilterRanges: object
 *   selectedProperty: object|null
 *   isViewportLoaded: boolean
 * }} LayersState
 */

/**
 * @template P
 * @typedef {import('@reduxjs/toolkit').CaseReducer<
 *   LayersState,
 *   import('@reduxjs/toolkit').PayloadAction<{
 *   key: string,
 *   } & P>
 * >} GenericOrbAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     crossFilterRanges: object
 *   }>} SetInitialCrossFilterRangesAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     propertyName: string
 *     filterRange?: number[]
 *   }>} SetFilterRangeAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     propertyName: string
 *     clipRange?: number[]
 *   }>} SetClipRangeAction
 */

/**
 * @typedef {GenericOrbAction<{
 *   data: string[]
 * }>} SetCrossFilterDataAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     selectedProperty: object
 *   }>} SetSelectedProperty
 */

/** @type {LayersState} */
const initialState = {
  crossFilteringLayerData: [],
  crossFilterRanges: {},
  selectedProperty: null,
  isViewportLoaded: false,
};

const handleMissingKey = () => {
  console.error(
    'payload.key does not exist. Key must be provided to set state',
  );
  return;
};

const crossFilterLayersSlice = createSlice({
  name: 'crossFilterLayers',
  initialState,
  reducers: {
    /** @type {SetInitialCrossFilterRangesAction} */
    setInitialCrossFilterRanges: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, crossFilterRanges } = payload;
      state[key] = crossFilterRanges;
    },
    /** @type {SetFilterRangeAction} */
    setFilterRange: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, propertyName, filterRange } = payload;
      state[key] = {
        ...state[key],
        [propertyName]: { ...(state[key][propertyName] ?? {}), filterRange },
      };
    },
    /** @type {SetClipRangeAction} */
    setClipRange: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, propertyName, clipRange } = payload;
      state[key] = {
        ...state[key],
        [propertyName]: { ...(state[key][propertyName] ?? {}), clipRange },
      };
    },
    /** @type {SetCrossFilterDataAction} */
    setCrossFilterData: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, data } = payload;
      state[key] = [...data];
    },

    /** @type {SetSelectedProperty} */
    setSelectedProperty: (state, { payload }) => {
      if (!payload) return handleMissingKey();
      const { key, selectedProperty } = payload;
      state[key] = selectedProperty;
    },
    resetSelectedProperty: (state, { payload }) => {
      state.selectedProperty = null;
    },
    setIsViewportLoaded: (state, { payload }) => {
      state.isViewportLoaded = payload;
    },
  },
});

export const {
  setCrossFilterData,
  setInitialCrossFilterRanges,
  setFilterRange,
  setClipRange,
  setSelectedProperty,
  resetSelectedProperty,
  setIsViewportLoaded,
} = crossFilterLayersSlice.actions;

/**
 * @param {import('./orbReducer').OrbState} orbs
 * @returns {LayersState}
 */
const baseSelector = orbs => orbs?.[crossFilterLayersSlice.name];

/**@param {string} id */
export const activeCrossFilteringLayersSelector = createSelector(
  baseSelector,
  state => state?.crossFilteringLayerData,
);

export const crossFilterRangesSelector = createSelector(
  baseSelector,
  state => state?.crossFilterRanges,
);

export const selectedPropertySelector = createSelector(
  baseSelector,
  state => state?.selectedProperty,
);

export const isViewportLoadedSelector = createSelector(
  baseSelector,
  state => state?.isViewportLoaded,
);

export default crossFilterLayersSlice.reducer;
