import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { logDataset, logError } from 'data-layers/data-layers.slice';

/**
 * @typedef CrowdlessState
 * @property {CrowdlessResponse} [results]
 * @property {CrowdlessFeature} [selectedResult]
 * @property {boolean} isLoading
 * @property {boolean} visible
 */

/**
 * @type {CrowdlessState}
 */
const initialState = { isLoading: false, visible: true };

const name = 'crowdless';

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<CrowdlessResponse, {source: Source, url: string}, {}>}
 */
export const fetchResults = createAsyncThunk(
  `${name}/fetchResults`,
  async ({ source, url }, { dispatch, rejectWithValue }) => {
    const {
      source_id,
      metadata: { api_key },
    } = source;
    try {
      const response = await fetch(url, { headers: { 'X-Api-Key': api_key } });

      if (!response.ok) {
        return dispatch(logError({ source_id }));
      }

      dispatch(logDataset({ source_id }));

      const data = await response.json();
      return data;
    } catch (e) {
      dispatch(logError({ source_id }));
      return rejectWithValue(e);
    }
  },
);

const crowdlessSlice = createSlice({
  name,
  initialState,
  reducers: {
    /** @param {import('@reduxjs/toolkit').PayloadAction<boolean>} action */
    setVisibility: (state, action) => {
      state.visible = action.payload;
      if (state.selectedResult !== undefined) state.selectedResult = undefined;
    },
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

export const { setSelectedResult, setVisibility } = crowdlessSlice.actions;

const baseSelector = orbs => orbs[crowdlessSlice.name];

export const isLoadingSelector = createSelector(
  baseSelector,
  state => state?.isLoading,
);

export const visibilitySelector = createSelector(
  baseSelector,
  state => !!state?.visible,
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
