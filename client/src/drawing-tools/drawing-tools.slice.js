import { createSelector, createSlice } from '@reduxjs/toolkit';
import { featureCollection } from '@turf/helpers';
import sampleData from './sample-drawing-data.json';

/**
 * @type {import('@reduxjs/toolkit').Slice<
 *  import('drawing-tools/types').DrawingToolsState,
 *  import('drawing-tools/types').DrawingToolsActions,
 *  'drawingTools'
 * >}
 */
const drawingToolsSlice = createSlice({
  name: 'drawingTools',
  initialState: { featureCollection: sampleData },
  reducers: {
    setFeatures: (state, { payload }) => {
      if (state.featureCollection == null)
        state.featureCollection = featureCollection(payload);
      else state.featureCollection.features = payload;
    },
  },
});

export const { setFeatures } = drawingToolsSlice.actions;

/** @param {import('react-redux').DefaultRootState} state */
const baseSelector = state => state.drawingTools;

export const drawingToolsFeatureCollectionSelector = createSelector(
  baseSelector,
  state => state?.featureCollection,
);

export default drawingToolsSlice.reducer;
