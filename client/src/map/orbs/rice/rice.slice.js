import { createSlice, createSelector } from '@reduxjs/toolkit';
import { orbsSelector } from '../orbsSelectors';

const slice = createSlice({
  name: 'rice',
  initialState: {
    maxDateRange: { min: Infinity, max: -Infinity },
  },
  reducers: {
    setDateRange: (state, { payload }) => {
      state.dateRange = payload;
    },
    setMaxDateRange: (state, { payload }) => {
      state.maxDateRange = payload;
    },
  },
});

export const { setDateRange, setMaxDateRange } = slice.actions;

const baseSelector = createSelector(orbsSelector, orbs => orbs[slice.name]);
export const maxDateRangeSelector = createSelector(
  baseSelector,
  rice => rice.maxDateRange,
);
export const dateRangeSelector = createSelector(
  [baseSelector, maxDateRangeSelector],
  (rice, maxDateRange) => rice.dateRange || maxDateRange,
);

export default slice.reducer;
