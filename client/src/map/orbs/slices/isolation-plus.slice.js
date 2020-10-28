import { createSlice, createSelector } from '@reduxjs/toolkit';

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState: {
    colorSchemes: {},
    property: {
      source_id: undefined,
      name: undefined,
    },
    pickedInfo: undefined,
  },
  reducers: {
    setProperty: (state, { payload }) => {
      state.property = payload;
    },
    setPickedInfo: (state, { payload }) => {
      state.pickedInfo = payload;
    },
  },
});

export const { setProperty, setPickedInfo } = isolationPlusSlice.actions;

const baseSelector = orbs => orbs?.[isolationPlusSlice.name];

export const colorSchemesSelector = createSelector(
  baseSelector,
  orb => orb?.colorSchemes,
);

export const colorSchemeSelector = createSelector(
  baseSelector,
  (_, source_id) => source_id,
  (orb, source_id) => orb?.colorSchemes?.[source_id],
);

export const propertySelector = createSelector(
  baseSelector,
  orb => orb?.property,
);

export const pickedInfoSelector = createSelector(
  baseSelector,
  orb => orb?.pickedInfo,
);

export default isolationPlusSlice.reducer;
