import { createSlice, createSelector } from '@reduxjs/toolkit';

import { CATEGORIES } from './mysupplylynk.constants';

import { orbsSelector } from '../orbsSelectors';

const mySupplyLynkSlice = createSlice({
  name: 'mySupplyLynk',
  initialState: {
    selectedFeatures: CATEGORIES,
  },
  reducers: {
    setSelectedFeatures: (state, { payload }) => {
      state.selectedFeatures = payload;
    },
  },
});

export const { setSelectedFeatures } = mySupplyLynkSlice.actions;

const baseSelector = createSelector(
  orbsSelector,
  orbs => orbs[mySupplyLynkSlice.name],
);

export const featuresSelector = createSelector(
  baseSelector,
  orb => orb?.selectedFeatures,
);

export default mySupplyLynkSlice.reducer;
