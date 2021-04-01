import { combineReducers } from 'redux';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import isolationPlus from './slices/isolation-plus.slice';
import crowdless from './slices/crowdless.slice';

/**
 * @typedef {ReturnType<orbReducer>} OrbState
 * @typedef {import('typings/orbis').GeoJsonFeature} GeoJsonFeature
 */

/**
 * @typedef {{
 *   [key: string]: {
 *     visible?: boolean,
 *     clickedFeatures?: GeoJsonFeature[]
 *     hoveredFeatures?: GeoJsonFeature[],
 *     filterValue?: any
 *     other?: any
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
 * @typedef {import('@reduxjs/toolkit').CaseReducer<
 *   LayersState,
 *   import('@reduxjs/toolkit').PayloadAction<number>
 * >} SetExtrusionScaleAction
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
      const { key: source_id, clickedFeatures } = payload;
      state[source_id] = { ...state[source_id], clickedFeatures };
    },
    /** @type {SetHoveredFeaturesAction} */
    setHoveredFeatures: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key: source_id, hoveredFeatures } = payload;
      state[source_id] = { ...state[source_id], hoveredFeatures };
    },
    /** @type {SetVisibilityAction} */
    setVisibility: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key: source_id, visible } = payload;
      state[source_id] = { ...state[source_id], visible };
    },
    /** @type {SetFilterValueAction} */
    setFilterValue: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key: source_id, filterValue } = payload;
      state[source_id] = { ...state[source_id], filterValue };
    },
    /** @type {SetOtherAction} */
    setOther: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key: source_id, other } = payload;
      state[source_id] = { ...state[source_id], other };
    },
    toggleExtrudedMode: state => {
      state.extrudedMode = !state.extrudedMode;
    },
    /** @type {SetExtrusionScaleAction} */
    setExtrusionScale: (state, { payload }) => {
      state.extrusionScale = payload;
    },
  },
});

export const {
  setClickedFeatures,
  setHoveredFeatures,
  setVisibility,
  setFilterValue,
  setOther,
  toggleExtrudedMode,
  setExtrusionScale,
} = layersSlice.actions;

/**
 * @param {OrbState} orbs
 * @returns {LayersState}
 */
const baseSelector = orbs => orbs?.[layersSlice.name];

/** @param {string} id */
export const clickedFeaturesSelector = id =>
  createSelector(baseSelector, state => state[id]?.clickedFeatures);

/** @param {string} id */
export const hoveredFeaturesSelector = id =>
  createSelector(baseSelector, state => state[id]?.hoveredFeatures);

/** @param {string} id */
export const layersVisibilitySelector = id =>
  createSelector(baseSelector, state => state?.[id]?.visible ?? true);

/** @param {string} id */
export const filterValueSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.filterValue);

/** @param {string} id */
export const otherSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.other);

export const extrudedModeSelector = createSelector(
  baseSelector,
  state => state?.extrudedMode,
);

export const extrusionScaleSelector = createSelector(
  baseSelector,
  state => state?.extrusionScale,
);

const orbReducer = combineReducers({
  layers: layersSlice.reducer,
  isolationPlus,
  crowdless,
});

export default orbReducer;
