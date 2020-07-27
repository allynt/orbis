import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'rice',
  initialState: {
    dateRange: { min: new Date(), max: new Date() },
  },
  reducers: {
    setDateRange: (state, { payload }) => {
      state.dateRange = payload;
    },
  },
});

export const { setDateRange } = slice.actions;
export default slice.reducer;
