import { combineReducers } from 'redux';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import rice from './rice/rice.slice';
import isolationPlus from './slices/isolation-plus.slice';
import mySupplyLynk from './slices/mysupplylynk.slice';
import actionForHelp from './slices/action-for-help.slice';
import crowdless from './slices/crowdless.slice';

import { orbsSelector } from '../orbs/orbsSelectors';

/**
 * @typedef {Object<string, {
 *    visible?: boolean,
 *    clickedFeatures?: import('typings/orbis').PickedMapFeature[],
 *    hoveredFeatures?: any[],
 * }> } LayersState
 */

/**
 * @typedef {import('@reduxjs/toolkit').CaseReducer<
 *   LayersState,
 *   import('@reduxjs/toolkit').PayloadAction<{
 *     source_id: import('typings/orbis').Source['source_id'],
 *     clickedFeatures?: import('typings/orbis').PickedMapFeature[]
 *   }>
 * >} SetClickedFeaturesAction
 */

/** @type {LayersState} */
const initialState = {};

const layersSlice = createSlice({
  name: 'layers',
  initialState,
  reducers: {
    /** @type {SetClickedFeaturesAction} */
    setClickedFeatures: (state, { payload }) => {
      const { source_id, clickedFeatures } = payload;
      state[source_id] = { ...state[source_id], clickedFeatures };
    },
  },
});

export const { setClickedFeatures } = layersSlice.actions;

const baseSelector = createSelector(
  orbsSelector,
  orbs => orbs[layersSlice.name] || {},
);

export const clickedFeaturesSelector = id =>
  createSelector(baseSelector, state => state[id]?.clickedFeatures);

const orbReducer = combineReducers({
  layers: layersSlice.reducer,
  rice,
  isolationPlus,
  mySupplyLynk,
  actionForHelp,
  crowdless,
});

export default orbReducer;
