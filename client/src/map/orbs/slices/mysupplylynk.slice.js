import { createSlice, createSelector } from '@reduxjs/toolkit';

import { CATEGORIES } from './mysupplylynk.constants';

const mySupplyLynkSlice = createSlice({
  name: 'mySupplyLynk',
  initialState: {
    categoryFilters: {},
    popupFeatures: { id: undefined, features: [] },
    dialogFeatures: [],
    dialogVisible: false,
  },
  reducers: {
    setSelectedFeatures: (state, { payload }) => {
      state.categoryFilters[payload.layer] = payload.value;
    },
    setPopupFeatures: (state, { payload }) => {
      state.popupFeatures = payload;
    },
    setDialogFeatures: (state, { payload }) => {
      state.dialogFeatures = payload;
    },
    toggleDialog: state => {
      state.dialogVisible = !state.dialogVisible;
    },
  },
});

export const {
  setSelectedFeatures,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
} = mySupplyLynkSlice.actions;

const baseSelector = orbs => orbs[mySupplyLynkSlice.name];

export const categoryFiltersSelector = createSelector(
  baseSelector,
  orb => orb?.categoryFilters,
);

export const categoryFiltersSelectorFactory = id =>
  createSelector(
    categoryFiltersSelector,
    filters => filters?.[id] || CATEGORIES,
  );

export const popupFeaturesSelector = createSelector(
  baseSelector,
  orb => orb?.popupFeatures,
);

export const dialogFeaturesSelector = createSelector(
  baseSelector,
  orb => orb?.dialogFeatures,
);

export const dialogVisibleSelector = createSelector(
  baseSelector,
  orb => orb?.dialogVisible,
);

export default mySupplyLynkSlice.reducer;
