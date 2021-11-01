/**
 * @typedef {import('typings').GeoJsonFeature} GeoJsonFeature
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';
import { unionBy, differenceBy } from 'lodash';

export const SHARED_STATE_KEY = 'shared';

/**
 * @typedef {{
 *   [key: string]: {
 *     visible?: boolean,
 *     clickedFeatures?: GeoJsonFeature[]
 *     hoveredFeatures?: GeoJsonFeature[],
 *     filterValue?: any
 *     other?: any
 *     timestamp?: number
 *     data?: any
 *   },
 *   extrudedMode: boolean
 *   extrusionScale: number
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
 *     clickedFeatures?: GeoJsonFeature[]
 *   }>} SetClickedFeaturesAction
 */

/**
 * @typedef {GenericOrbAction<{
 *   uniquePropertyPath: string
 *   clickedFeatures: GeoJsonFeature[]
 * }>} AddClickedFeaturesAction
 */

/**
 * @typedef {GenericOrbAction<{
 *   uniquePropertyPath: string
 *   clickedFeatures: GeoJsonFeature[]
 * }>} RemoveClickedFeaturesAction
 */

/**
 * @typedef {GenericOrbAction<{
 *   layersToBeRemoved: string[]
 * }>} ClearLayerFeaturesAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     hoveredFeatures?: GeoJsonFeature[]
 *   }>} SetHoveredFeaturesAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     visible?: boolean
 *   }>} SetVisibilityAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     filterValue?: any
 *   }>} SetFilterValueAction
 */

/**
 * @typedef {GenericOrbAction<{
 *    other?: any
 * }>} SetOtherAction
 */

/**
 * @typedef {GenericOrbAction<{
 *   timestamp?: number
 * }>} SetTimestampAction
 */

/**
 * @typedef {GenericOrbAction<{
 *   data?: any
 * }>} SetDataAction
 */

/**
 * @typedef {import('@reduxjs/toolkit').CaseReducer<
 *   LayersState,
 *   import('@reduxjs/toolkit').PayloadAction<number>
 * >} SetExtrusionScaleAction
 */

/**
 * @typedef {import('@reduxjs/toolkit').CaseReducer<
 *   LayersState,
 *   import('@reduxjs/toolkit').PayloadAction<LayersState>
 * >} SetStateAction
 */

/** @type {LayersState} */
const initialState = {
  extrudedMode: false,
  extrusionScale: 50,
};

const handleMissingKey = () => {
  console.error(
    'payload.key does not exist. Key must be provided to set state',
  );
  return;
};

const layersSlice = createSlice({
  name: 'layers',
  initialState,
  reducers: {
    /** @type {SetClickedFeaturesAction} */
    setClickedFeatures: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, clickedFeatures } = payload;
      state[key] = { ...state[key], clickedFeatures };
    },
    /** @type {AddClickedFeaturesAction} */
    addClickedFeatures: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { clickedFeatures: newFeatures, key, uniquePropertyPath } = payload;
      const existingFeatures = state[key]?.clickedFeatures;
      state[key] = {
        ...state[key],
        clickedFeatures: unionBy(
          existingFeatures,
          newFeatures,
          uniquePropertyPath,
        ),
      };
    },
    /** @type {RemoveClickedFeaturesAction} */
    removeClickedFeatures: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const {
        clickedFeatures: removingFeatures,
        key,
        uniquePropertyPath,
      } = payload;
      const existingFeatures = state[key]?.clickedFeatures;
      const newFeatures = differenceBy(
        existingFeatures,
        removingFeatures,
        uniquePropertyPath,
      );
      state[key] = {
        ...state[key],
        clickedFeatures: newFeatures.length ? newFeatures : undefined,
      };
    },
    /** @type {ClearLayerFeaturesAction} */
    clearLayerFeatures: (state, { payload }) => {
      if (!payload) return;
      const { layersToBeRemoved } = payload;
      layersToBeRemoved.forEach(
        key => (state[key].clickedFeatures = undefined),
      );
    },
    /** @type {SetHoveredFeaturesAction} */
    setHoveredFeatures: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, hoveredFeatures } = payload;
      state[key] = { ...state[key], hoveredFeatures };
    },
    /** @type {SetVisibilityAction} */
    setVisibility: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, visible } = payload;
      state[key] = { ...state[key], visible };
    },
    /** @type {SetFilterValueAction} */
    setFilterValue: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, filterValue } = payload;
      state[key] = { ...state[key], filterValue };
    },
    /** @type {SetOtherAction} */
    setOther: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, other } = payload;
      state[key] = { ...state[key], other };
    },
    /** @type {SetTimestampAction} */
    setTimestamp: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, timestamp } = payload;
      state[key] = { ...state[key], timestamp };
    },
    /** @type {SetDataAction} */
    setData: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, data } = payload;
      state[key] = { ...state[key], data };
    },
    toggleExtrudedMode: state => {
      state.extrudedMode = !state.extrudedMode;
    },
    /** @type {SetExtrusionScaleAction} */
    setExtrusionScale: (state, { payload }) => {
      state.extrusionScale = payload;
    },
    /** @type {SetStateAction} */
    setState: (_, { payload }) => payload,
  },
});

export const {
  addClickedFeatures,
  removeClickedFeatures,
  clearLayerFeatures,
  setClickedFeatures,
  setData,
  setExtrusionScale,
  setFilterValue,
  setHoveredFeatures,
  setOther,
  setState,
  setTimestamp,
  setVisibility,
  toggleExtrudedMode,
} = layersSlice.actions;

/**
 * @param {import('./orbReducer').OrbState} orbs
 * @returns {LayersState}
 */
const baseSelector = orbs => orbs?.[layersSlice.name];

export const layersWithDataSelector = createSelector(baseSelector, state =>
  Object.entries(state ?? {}).reduce(
    (acc, [key, value]) =>
      value != null && typeof value === 'object' && 'data' in value
        ? [...acc, key]
        : acc,
    [],
  ),
);

/**@param {string} id */
export const dataSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.data);

/** @param {string} id */
export const clickedFeaturesSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.clickedFeatures);

/** @param {string} id */
export const hoveredFeaturesSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.hoveredFeatures);

/** @param {string} id */
export const visibilitySelector = id =>
  createSelector(baseSelector, state => state?.[id]?.visible ?? true);

/** @param {string} id */
export const filterValueSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.filterValue);

/** @param {string} id */
export const otherSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.other);

/** @param {string} id */
export const timestampSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.timestamp);

export const extrudedModeSelector = createSelector(
  baseSelector,
  state => state?.extrudedMode,
);

export const extrusionScaleSelector = createSelector(
  baseSelector,
  state => state?.extrusionScale,
);

export default layersSlice.reducer;
