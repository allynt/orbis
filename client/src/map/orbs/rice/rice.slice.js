import { createSlice } from '@reduxjs/toolkit';

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
export default slice.reducer;
