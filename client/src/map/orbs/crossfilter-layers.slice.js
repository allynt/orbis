/**
 * @typedef {import('typings').GeoJsonFeature} GeoJsonFeature
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';

export const SHARED_STATE_KEY = 'shared';

/**
 * @typedef {{
 *   crossFilteringLayerData: string[]
 *   crossFilterValues: object
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
 *     crossFilterValues: object[]
 *   }>} SetFilterValuesAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     propertyName: string
 *     filterValue?: number[]
 *   }>} SetFilterValueAction
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
  crossFilterValues: {},
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
    /** @type {SetFilterValuesAction} */
    setFilterValues: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, crossFilterValues } = payload;
      state[key] = crossFilterValues;
    },
    /** @type {SetFilterValueAction} */
    setFilterValue: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, propertyName, filterValue } = payload;
      state[key] = { ...state[key], [propertyName]: filterValue };
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
  setFilterValues,
  setFilterValue,
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

export const crossFilterValuesSelector = createSelector(
  baseSelector,
  state => state?.crossFilterValues,
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
