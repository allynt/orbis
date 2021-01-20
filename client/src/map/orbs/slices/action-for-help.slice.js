import { createSelector, createSlice } from '@reduxjs/toolkit';

import { orbsSelector } from '../orbsSelectors';

const actionForHelpSlice = createSlice({
  name: 'actionForHelp',
  initialState: {
    pickedObjects: [],
    layersVisibility: {},
  },
  reducers: {
    setPickedObjects: (state, { payload }) => {
      state.pickedObjects = payload;
    },
    setVisibility: (state, { payload }) => {
      state.layersVisibility = {
        ...state.layersVisibility,
        [payload.id]: payload.value,
      };
    },
  },
});

export const { setPickedObjects, setVisibility } = actionForHelpSlice.actions;

const baseSelector = createSelector(
  orbsSelector,
  orbs => orbs[actionForHelpSlice.name],
);

export const pickedObjectsSelector = createSelector(
  baseSelector,
  state => state?.pickedObjects,
);

export const layersVisibilitySelector = id =>
  createSelector(baseSelector, state => state?.layersVisibility[id] || true);

export default actionForHelpSlice.reducer;
