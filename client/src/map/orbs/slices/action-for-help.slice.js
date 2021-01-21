import { createSelector, createSlice } from '@reduxjs/toolkit';

import { orbsSelector } from '../orbsSelectors';

const actionForHelpSlice = createSlice({
  name: 'actionForHelp',
  initialState: {
    pickedObjects: [],
  },
  reducers: {
    setPickedObjects: (state, { payload }) => {
      state.pickedObjects = payload;
    },
  },
});

export const { setPickedObjects } = actionForHelpSlice.actions;

const baseSelector = createSelector(
  orbsSelector,
  orbs => orbs[actionForHelpSlice.name],
);

export const pickedObjectsSelector = createSelector(
  baseSelector,
  state => state?.pickedObjects,
);

export default actionForHelpSlice.reducer;
