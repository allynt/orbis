import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { getData } from 'utils/http';
import { orbsSelector } from '../orbsSelectors';

/**
 * @typedef CrowdlessState
 * @property {CrowdlessResponse} [results]
 * @property {boolean} isLoading
 */

/**
 * @type {CrowdlessState}
 */
const initialState = { isLoading: false };

const name = 'crowdless';

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<CrowdlessResponse, string, {}>}
 */
export const fetchResults = createAsyncThunk(
  `${name}/fetchResults`,
  async (url, { rejectWithValue }) => {
    try {
      const response = await getData(url);
      const data = await response.json();
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const crowdlessSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchResults.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchResults.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.results = payload;
    });
    builder.addCase(fetchResults.rejected, state => {
      state.isLoading = false;
    });
  },
});

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

export default crowdlessSlice.reducer;
