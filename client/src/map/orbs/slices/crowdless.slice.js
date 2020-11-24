import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { logError } from 'data-layers/data-layers.slice';

/**
 * @typedef CrowdlessState
 * @property {CrowdlessResponse} [results]
 * @property {CrowdlessFeature} [selectedResult]
 * @property {boolean} isLoading
 */

/**
 * @type {CrowdlessState}
 */
const initialState = { isLoading: false };

const name = 'crowdless';

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<CrowdlessResponse, {}, {}>}
 */
export const fetchResults = createAsyncThunk(
  `${name}/fetchResults`,
  async ({ sourceId, url }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        return dispatch(logError({ source_id: sourceId }));
      }
      const data = await response.json();
      return data;
    } catch (e) {
      dispatch(logError({ source_id: sourceId }));
      return rejectWithValue(e);
    }
  },
);

const crowdlessSlice = createSlice({
  name,
  initialState,
  reducers: {
    /** @param {import('@reduxjs/toolkit').PayloadAction<CrowdlessFeature>} action */
    setSelectedResult: (state, action) => {
      state.selectedResult = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchResults.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchResults.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.results = payload;
        if (state.selectedResult) state.selectedResult = undefined;
      })
      .addCase(fetchResults.rejected, state => {
        state.isLoading = false;
      }),
});

export const { setSelectedResult } = crowdlessSlice.actions;

/** @type {import('@reduxjs/toolkit').Selector<any, CrowdlessState>} */
const baseSelector = orbs => orbs[crowdlessSlice.name];

export const isLoadingSelector = createSelector(
  baseSelector,
  state => state?.isLoading,
);

export const resultsSelector = createSelector(
  baseSelector,
  state => state?.results,
);

export const selectedResultSelector = createSelector(
  baseSelector,
  state => state?.selectedResult,
);

export default crowdlessSlice.reducer;
