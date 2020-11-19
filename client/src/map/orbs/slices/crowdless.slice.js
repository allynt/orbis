import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { getData } from 'utils/http';
import { orbsSelector } from '../orbsSelectors';

/**
 * @typedef CrowdlessState
 * @property {CrowdlessFeature[]} [results]
 * @property {boolean} isLoading
 */

/**
 * @type {CrowdlessState}
 */
const initialState = { isLoading: false };

const name = 'crowdless';

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<CrowdlessFeature[], string, any>}
 */
export const fetchResults = createAsyncThunk(
  `${name}/fetchResults`,
  async url => {
    const response = await getData(url);
    const data = await response.json();
    console.log(data);
    return data;
  },
);

const crowdlessSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {
    [fetchResults.pending.type]: state => {
      state.isLoading = true;
    },
    /**
     * @param {import('@reduxjs/toolkit').PayloadAction<CrowdlessFeature[]>} action
     */
    [fetchResults.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.results = action.payload;
    },
    [fetchResults.rejected.type]: state => {
      state.isLoading = false;
    },
  },
});

/** @type {import('@reduxjs/toolkit').Selector<any, CrowdlessState>} */
const baseSelector = createSelector(
  orbsSelector,
  orbs => orbs[crowdlessSlice.name],
);

export const isLoadingSelector = createSelector(
  baseSelector,
  state => state?.isLoading,
);

export const resultsSelector = createSelector(
  baseSelector,
  state => state?.results,
);

export default crowdlessSlice.reducer;
