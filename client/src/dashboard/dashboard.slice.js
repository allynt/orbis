import { createSlice, createSelector } from '@reduxjs/toolkit';

import { userSelector } from 'accounts/accounts.selectors';

export const initialState = {
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setChartData: (state, { payload }) => {
      const { source_id, datasetName, data } = payload;

      state[source_id] = {
        ...state[source_id],
        [datasetName]: data,
      };
    },
  },
});

export const fetchChartData = (
  source_id,
  datasetName,
  url,
) => async dispatch => {
  const result = await import(`${url}.js`);
  dispatch(setChartData({ source_id, datasetName, data: result.default }));
};

export const updateTargets = (source_id, addedTargets) => async dispatch => {
  const data = {
    [source_id]: addedTargets,
  };

  console.log('Data to be dispatched: ', data);
  // sets addedTargets on user object
};

export const { setChartData } = dashboardSlice.actions;

/** @param {import('typings').RootState} state */
const baseSelector = state => state?.dashboard;

/** @param {import('typings').Source['source_id']} source_id */
/** @param {string} datasetName */
export const chartDataSelector = (source_id, datasetName) =>
  createSelector(baseSelector, state => state?.[source_id]?.[datasetName]);

/** @param {import('typings').Source['source_id']} source_id */
/** @param {string} datasetName */
export const userTargetSelector = (source_id, datasetName) =>
  createSelector(
    userSelector,
    user =>
      user?.profiles?.orbis_profile?.orb_state?.[source_id]?.[datasetName] ??
      {},
  );

export default dashboardSlice.reducer;
