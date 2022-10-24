import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { logDataset, logError } from 'data-layers/data-layers.slice';
import { getAuthTokenForSource } from 'utils/tokens';

const initialState = { isLoading: false, visible: true };

const name = 'aisShipping';

export const fetchResults = createAsyncThunk(
  `${name}/fetchResults`,
  async ({ source, url }, { dispatch, getState, rejectWithValue }) => {

    const { source_id } = source;

    const {
      data: { tokens },
    } = getState();
    const authToken = getAuthTokenForSource(tokens, {
      source_id: source_id,
    });

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
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

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setVisibility: (state, action) => {
      state.visible = action.payload;
      if (state.selectedResult !== undefined) state.selectedResult = undefined;
    },
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

export const { setSelectedResult, setVisibility } = slice.actions;

const baseSelector = orbs => orbs[slice.name];

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

export default slice.reducer;
