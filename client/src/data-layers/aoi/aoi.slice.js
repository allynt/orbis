import { createSlice, createSelector } from '@reduxjs/toolkit';

import { Panels } from '../data-layers.constants';

const name = 'aois';

const initialState = {
  isDrawingAoi: false,
  visiblePanel: Panels.DATA_LAYERS,
};

const satellitesSlice = createSlice({
  name,
  initialState,
  reducers: {
    startDrawingAoi: state => {
      state.isDrawingAoi = true;
      if (state.aoi?.length >= 1) state.aoi = undefined;
    },
    endDrawingAoi: (state, { payload }) => {
      state.isDrawingAoi = false;
      state.aoi = payload;
    },
    onUnmount: state => {
      state.isDrawingAoi = false;
    },
    setVisiblePanel: (state, { payload }) => {
      state.visiblePanel = payload;
    },
  },
});

export const {
  startDrawingAoi,
  endDrawingAoi,
  onUnmount,
  setVisiblePanel,
} = satellitesSlice.actions;

const baseSelector = state => state?.aois;

export const aoiSelector = createSelector(baseSelector, state => state?.aoi);

export const isDrawingAoiSelector = createSelector(
  baseSelector,
  state => state?.isDrawingAoi,
);

export const visiblePanelSelector = createSelector(
  baseSelector,
  state => state?.visiblePanel,
);

export default satellitesSlice.reducer;
