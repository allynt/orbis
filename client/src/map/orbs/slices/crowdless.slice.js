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

export const fetchProxyResults = createAsyncThunk(
  `${name}/fetchProxyResults`,
  async ({ source, url }, { dispatch, rejectWithValue }) => {
    const {
      source_id,
      metadata: { api_key },
    } = source;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization:
            'Bearer c9ebeba2b9babf7668b7787bfe9f45e7d62891105eeee00a41bef1da1903ca4e',
          // TODO: GET REAL TOKEN
          // Authorization: `Bearer ${this.props.authToken}`,
        },
      });
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
      })
      .addCase(fetchProxyResults.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchProxyResults.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.proxyResults = payload;
        if (state.selectedResult) state.selectedResult = undefined;
      })
      .addCase(fetchProxyResults.rejected, state => {
        state.isLoading = false;
      }),
});

export const { setSelectedResult, setVisibility } = crowdlessSlice.actions;

/**
 * @param {import('../orbReducer').OrbState} orbs
 */
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

export const proxyResultsSelector = createSelector(
  baseSelector,
  state => state?.proxyResults,
);

export const selectedResultSelector = createSelector(
  baseSelector,
  state => state?.selectedResult,
);

export default crowdlessSlice.reducer;
