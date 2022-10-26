/**
 * @typedef {import('typings').GeoJsonFeature} GeoJsonFeature
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';

export const SHARED_STATE_KEY = 'shared';

/**
 * @typedef {{
 *   crossFilterValues: object
 *   crossFilteringLayerData: string[]
 *   selectedProperty: object|null
 *   crossFilteringCommonGeometry: string|null
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
 *     propertyName: string
 *     filterValue?: number[]
 *   }>} SetFilterValueAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     selectedProperty: object
 *   }>} SetSelectedProperty
 */

/**
 * @typedef {GenericOrbAction<{
 *   data: string[]
 * }>} SetCrossFilterDataAction
 */

/** @type {LayersState} */
const initialState = {
  crossFilteringLayerData: [],
  crossFilterValues: {},
  selectedProperty: null,
  crossFilteringCommonGeometry: 'MSOA',
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
    /** @type {SetFilterValueAction} */
    setFilterValues: (state, { payload }) => {
      state.crossFilterValues = payload;
    },
    setFilterValue: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, propertyName, filterValue } = payload;
      state[key] = { ...state[key], [propertyName]: filterValue };
    },
    /** @type {SetSelectedProperty} */
    setSelectedProperty: (state, { payload }) => {
      if (!payload) return handleMissingKey();
      const { key, selectedProperty } = payload;
      state[key] = selectedProperty;
    },
    /** @type {SetCrossFilterDataAction} */
    setCrossFilterData: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, data } = payload;
      state[key] = [...state[key], ...data];
    },
  },
});

export const {
  setCrossFilterData,
  setFilterValues,
  setFilterValue,
  setSelectedProperty,
} = crossFilterLayersSlice.actions;

/**
 * @param {import('./orbReducer').OrbState} orbs
 * @returns {LayersState}
 */
const baseSelector = orbs => orbs?.[crossFilterLayersSlice.name];

export const crossFilterLayersWithDataSelector = createSelector(
  baseSelector,
  state =>
    Object.entries(state ?? {}).reduce(
      (acc, [key, value]) =>
        value != null && typeof value === 'object' && 'data' in value
          ? [...acc, key]
          : acc,
      [],
    ),
);

/**@param {string} id */
export const dataSelector = createSelector(
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

export const crossFilteringCommonGeometrySelector = createSelector(
  baseSelector,
  state => state?.crossFilteringCommonGeometry ?? null,
);

export default crossFilterLayersSlice.reducer;
