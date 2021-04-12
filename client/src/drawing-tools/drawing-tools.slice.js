import { createSelector, createSlice } from '@reduxjs/toolkit';

/**
 * @type {import('@reduxjs/toolkit').Slice<
 *  import('drawing-tools').DrawingToolsState,
 *  import('drawing-tools').DrawingToolsActions,
 *  'drawingTools'
 * >}
 */
const drawingToolsSlice = createSlice({
  name: 'drawingTools',
  initialState: {},
  reducers: {
    setFeatures: (state, { payload }) => {
      state.features = payload;
    },
  },
});

export const { setFeatures } = drawingToolsSlice.actions;

/** @param {import('react-redux').DefaultRootState} state */
const baseSelector = state => state.drawingTools;

export const drawingToolsFeaturesSelector = createSelector(
  baseSelector,
  state => state?.features,
);

export default drawingToolsSlice.reducer;
