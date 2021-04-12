import { createSelector, createSlice } from '@reduxjs/toolkit';

const drawingToolsSlice = createSlice({
  name: 'drawingTools',
  /** @type {import('./drawing-tools.slice').DrawingToolsState} */
  initialState: {},
  reducers: {
    /**
     * @type {import('@reduxjs/toolkit').CaseReducer<
     *  import('./drawing-tools.slice').DrawingToolsState,
     *  import('@reduxjs/toolkit').PayloadAction<
     *    import('@turf/helpers').Feature[]>
     * >}
     */
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
