import { createSelector, createSlice } from '@reduxjs/toolkit';
import { featureCollection } from '@turf/helpers';

/**
 * @type {import('@reduxjs/toolkit').Slice<
 *  import('drawing-tools/types').DrawingToolsState,
 *  import('drawing-tools/types').DrawingToolsActions,
 *  'drawingTools'
 * >}
 */
const drawingToolsSlice = createSlice({
  name: 'drawingTools',
  initialState: {},
  reducers: {
    setFeatures: (state, { payload }) => {
      if ('type' in payload) state.features = payload.features;
      else state.features = payload;
    },
  },
});

export const { setFeatures } = drawingToolsSlice.actions;

/** @param {import('react-redux').DefaultRootState} state */
const baseSelector = state => state.drawingTools;

export const drawingToolsFeatureCollectionSelector = createSelector(
  baseSelector,
  state => featureCollection(state?.features || []),
);

export default drawingToolsSlice.reducer;
