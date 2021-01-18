import { createSlice, createSelector } from '@reduxjs/toolkit';

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState: {
    property: {
      source_id: undefined,
      name: undefined,
    },
    pickedInfo: undefined,
    filterRange: [undefined, undefined],
  },
  reducers: {
    setProperty: (state, { payload }) => {
      if (state.pickedInfo?.layer?.id !== payload.source_id)
        state.pickedInfo = undefined;
      state.property = payload;
      state.filterRange = [payload.min, payload.max];
    },
    setPickedInfo: (state, { payload }) => {
      state.pickedInfo = payload;
    },
    setFilterRange: (state, { payload }) => {
      state.filterRange = payload;
    },
  },
});

export const {
  setProperty,
  setPickedInfo,
  setFilterRange,
} = isolationPlusSlice.actions;

const baseSelector = orbs => orbs?.[isolationPlusSlice.name];

export const propertySelector = createSelector(
  baseSelector,
  orb => orb?.property,
);

export const pickedInfoSelector = createSelector(
  baseSelector,
  orb => orb?.pickedInfo,
);

export const filterRangeSelector = createSelector(
  baseSelector,
  orb => orb?.filterRange,
);

export default isolationPlusSlice.reducer;
