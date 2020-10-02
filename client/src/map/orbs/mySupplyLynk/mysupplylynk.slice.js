import { createSlice, createSelector } from '@reduxjs/toolkit';

import { CATEGORIES } from './mysupplylynk.constants';

import { orbsSelector } from '../orbsSelectors';

const mySupplyLynkSlice = createSlice({
  name: 'mySupplyLynk',
  initialState: {
    categoryFilters: CATEGORIES,
    popupFeatures: [],
    dialogFeatures: [],
  },
  reducers: {
    setSelectedFeatures: (state, { payload }) => {
      state.categoryFilters = payload;
    },
    setPopupFeatures: (state, { payload }) => {
      state.popupFeatures = payload;
    },
    setDialogFeatures: (state, { payload }) => {
      state.dialogFeatures = payload;
    },
  },
});

export const {
  setSelectedFeatures,
  setDialogFeatures,
  setPopupFeatures,
} = mySupplyLynkSlice.actions;

const baseSelector = createSelector(
  orbsSelector,
  orbs => orbs[mySupplyLynkSlice.name],
);

export const categoryFiltersSelector = createSelector(
  baseSelector,
  orb => orb?.categoryFilters,
);

export const popupFeaturesSelector = createSelector(
  baseSelector,
  orb => orb?.popupFeatures,
);

export const dialogFeaturesSelector = createSelector(
  baseSelector,
  orb => orb?.dialogFeatures,
);

export default mySupplyLynkSlice.reducer;
