import { createSlice, createSelector } from '@reduxjs/toolkit';

export const initialState = {
  isLoading: false,
  error: null,
};

const dashboardsSlice = createSlice({
  name: 'dashboards',
  initialState,
  reducers: {
    setWidgetData: (state, { payload }) => {
      const { source_id, datasetName, data } = payload;

      state[source_id] = {
        ...state[source_id],
        [datasetName]: data,
      };
    },
  },
});

export const fetchWidgetData = (
  source_id,
  datasetName,
  url,
) => async dispatch => {
  const result = await import(`${url}.js`);
  dispatch(setWidgetData({ source_id, datasetName, data: result.default }));
};

export const { setWidgetData } = dashboardsSlice.actions;

/** @param {import('typings').RootState} state */
const baseSelector = state => state?.dashboards;

/** @param {import('typings').Source['source_id']} source_id */
/** @param {string} datasetName */
export const widgetDataSelector = (source_id, datasetName) => {
  return createSelector(baseSelector, state => {
    return state?.[source_id]?.[datasetName];
  });
};

export default dashboardsSlice.reducer;
