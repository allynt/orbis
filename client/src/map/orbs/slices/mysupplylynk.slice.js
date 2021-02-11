import { createSlice, createSelector } from '@reduxjs/toolkit';

const mySupplyLynkSlice = createSlice({
  name: 'mySupplyLynk',
  initialState: {
    popupFeatures: { id: undefined, features: [] },
    dialogFeatures: [],
    dialogVisible: false,
  },
  reducers: {
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
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
} = mySupplyLynkSlice.actions;

const baseSelector = orbs => orbs?.[mySupplyLynkSlice.name];

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
  orb => !!orb?.dialogVisible,
);

export default mySupplyLynkSlice.reducer;
