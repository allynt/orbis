import { createSlice, createSelector } from '@reduxjs/toolkit';

export const initialState = {};

const dashboardsSlice = createSlice({
  name: 'dashboards',
  initialState,
  reducers: {
    setWidgetData: (state, { payload }) => {
      const { source_id, component, data } = payload;

      state[source_id] = {
        ...state[source_id],
        [component]: data,
      };
    },
  },
});

export const getWidgetData = (source_id, component, url) => async dispatch => {
  const result = await import(`./mock-data/waltham-forest/${url}`);

  const data = result.default.properties?.[0]?.data;

  dispatch(setWidgetData({ source_id, component, data }));
};

export const { setWidgetData } = dashboardsSlice.actions;

/** @param {import('typings').RootState} state */
const baseSelector = state => state?.dashboards;

/** @param {import('typings').Source} source_id */
/** @param {string} widgetName */
export const widgetDataSelector = (source_id, widgetName) => {
  return createSelector(baseSelector, state => {
    return state?.[source_id]?.[widgetName];
  });
};

export default dashboardsSlice.reducer;
