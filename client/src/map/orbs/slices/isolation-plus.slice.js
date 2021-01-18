import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * @typedef IsolationPlusState
 * @property {any[]} [clickedFeatures]
 * @property {import('typings/orbis').Property & {source_id: string}} [property]
 * @property {[number, number]} [filterRange]
 */

/** @type {IsolationPlusState} */
const initialState = {
  property: {
    source_id: undefined,
    name: undefined,
  },
  pickedInfo: undefined,
  filterRange: [undefined, undefined],
};

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState,
  reducers: {
    setProperty: (state, { payload }) => {
      if (state.clickedFeatures?.[0]?.layer?.id !== payload.source_id)
        state.clickedFeatures = undefined;
      state.property = payload;
      state.filterRange = [payload.min, payload.max];
    },
    setClickedFeatures: (state, { payload }) => {
      state.clickedFeatures = payload;
    },
    setFilterRange: (state, { payload }) => {
      state.filterRange = payload;
    },
  },
});

export const {
  setProperty,
  setClickedFeatures,
  setFilterRange,
} = isolationPlusSlice.actions;

/** @returns {IsolationPlusState} */
const baseSelector = orbs => orbs?.[isolationPlusSlice.name];

export const propertySelector = createSelector(
  baseSelector,
  orb => orb?.property,
);

export const clickedFeaturesSelector = createSelector(
  baseSelector,
  orb => orb?.clickedFeatures,
);

export const filterRangeSelector = createSelector(
  baseSelector,
  orb => orb?.filterRange,
);

export default isolationPlusSlice.reducer;
