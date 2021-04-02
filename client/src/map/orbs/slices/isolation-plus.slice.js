import { createSlice, createSelector } from '@reduxjs/toolkit';
import { differenceBy, unionBy } from 'lodash';

/**
 * @typedef {{
 *   clickedFeatures?: import('typings/orbis').PolygonPickedMapFeature[]
 *   property?: import('typings/orbis').Property & {source_id: string}
 * }} IsolationPlusState
 */

/** @type {IsolationPlusState} */
const initialState = {
  property: {
    source_id: undefined,
    name: undefined,
  },
};

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState,
  reducers: {
    setState: (state, { payload }) => {
      state.property = payload?.property || {};
      state.clickedFeatures = payload?.clickedFeatures;
    },
    setProperty: (state, { payload }) => {
      if (state.clickedFeatures?.[0]?.layer?.id !== payload.source_id)
        state.clickedFeatures = undefined;
      state.property = payload;
    },
  },
});

export const { setState, setProperty } = isolationPlusSlice.actions;

/**
 * @param {import('../orbReducer').OrbState} orbs
 * @returns {IsolationPlusState}
 */
const baseSelector = orbs => orbs?.[isolationPlusSlice.name];

export const propertySelector = createSelector(
  baseSelector,
  orb => orb?.property,
);

export default isolationPlusSlice.reducer;
