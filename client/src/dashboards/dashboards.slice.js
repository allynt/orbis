import { createSlice, createSelector } from '@reduxjs/toolkit';

export const initialState = {};

const dashboardsSlice = createSlice({
  name: 'dashboards',
  initialState,
  reducers: {
    setWidgetData: (state, { payload }) => {
      const { source_id, name, data } = payload;

      state[source_id] = {
        ...state[source_id],
        [name]: data,
      };
    },
  },
});

export const fetchWidgetData = (source_id, name, url) => async dispatch => {
  const result = await import(`${url}.js`);
  dispatch(setWidgetData({ source_id, name, data: result.default }));
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
