import { createSlice, createSelector } from '@reduxjs/toolkit';

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

export const updateTargets = () => async dispatch => {};

export const { setChartData } = dashboardSlice.actions;

/** @param {import('typings').RootState} state */
const baseSelector = state => state?.dashboard;

/** @param {import('typings').Source['source_id']} source_id */
/** @param {string} datasetName */
export const chartDataSelector = (source_id, datasetName) => {
  return createSelector(baseSelector, state => {
    return state?.[source_id]?.[datasetName];
  });
};

export default dashboardSlice.reducer;
