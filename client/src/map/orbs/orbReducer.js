import { combineReducers } from 'redux';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import rice from './rice/rice.slice';
import isolationPlus from './slices/isolation-plus.slice';
import mySupplyLynk from './slices/mysupplylynk.slice';
import actionForHelp from './slices/action-for-help.slice';
import crowdless from './slices/crowdless.slice';

/**
 * @typedef {{
 *   [key: string]: {
 *     visible?: boolean,
 *     clickedFeatures?: import('typings/orbis').GeoJsonFeature[]
 *     hoveredFeatures?: any[],
 *   },
 *   extrudedMode: boolean
 * }} LayersState
 */

/**
 * @typedef {import('@reduxjs/toolkit').CaseReducer<
 *   LayersState,
 *   import('@reduxjs/toolkit').PayloadAction<{
 *     source_id: import('typings/orbis').Source['source_id'],
 *     clickedFeatures?: import('typings/orbis').GeoJsonFeature[]
 *   }>
 * >} SetClickedFeaturesAction
 */

/**
 * @typedef {import('@reduxjs/toolkit').CaseReducer<
 *   LayersState,
 *   import('@reduxjs/toolkit').PayloadAction<{
 *     source_id: import('typings/orbis').Source['source_id'],
 *     visible?: boolean
 *   }>
 * >} SetVisibilityAction
 */

/** @type {LayersState} */
const initialState = {
  extrudedMode: false,
};

const layersSlice = createSlice({
  name: 'layers',
  initialState,
  reducers: {
    /** @type {SetClickedFeaturesAction} */
    setClickedFeatures: (state, { payload }) => {
      const { source_id, clickedFeatures } = payload;
      state[source_id] = { ...state[source_id], clickedFeatures };
    },
    /** @type {SetVisibilityAction} */
    setVisibility: (state, { payload }) => {
      const { source_id, visible } = payload;
      state[source_id] = { ...state[source_id], visible };
    },
    toggleExtrudedMode: state => {
      state.extrudedMode = !state.extrudedMode;
    },
  },
});

export const {
  setClickedFeatures,
  setVisibility,
  toggleExtrudedMode,
} = layersSlice.actions;

const baseSelector = orbs => orbs?.[layersSlice.name] || {};

export const clickedFeaturesSelector = id =>
  createSelector(baseSelector, state => state[id]?.clickedFeatures);

export const layersVisibilitySelector = id =>
  createSelector(baseSelector, state => state[id]?.visible ?? true);

export const extrudedModeSelector = createSelector(
  baseSelector,
  state => state.extrudedMode,
);

const orbReducer = combineReducers({
  layers: layersSlice.reducer,
  rice,
  isolationPlus,
  mySupplyLynk,
  actionForHelp,
  crowdless,
});

export default orbReducer;
