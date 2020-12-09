import { createSlice, createSelector } from '@reduxjs/toolkit';

import { CATEGORIES } from './mysupplylynk.constants';

const mySupplyLynkSlice = createSlice({
  name: 'mySupplyLynk',
  initialState: {
    categoryFilters: {
      'astrosat/mysupplylynk/suppliers/latest': CATEGORIES,
      'astrosat/mysupplylynk/more-suppliers/latest': CATEGORIES,
    },
    popupFeatures: [],
    dialogFeatures: [],
    dialogVisible: false,
  },
  reducers: {
    setSelectedFeatures: (state, { payload }) => {
      state.categoryFilters[payload.type] = payload.value;
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
