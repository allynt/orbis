import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getJsonAuthHeaders, getData } from 'utils/http';

const initialState = {
  layers: [],
  pollingPeriod: 30000,
  token: null,
  sources: null
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addLayers: (state, { payload }) => {
      let newLayers;
      if (typeof payload[0] === 'object') {
        newLayers = payload.map(layer => layer.name);
      } else {
        newLayers = payload;
      }
      state.layers = Array.from(new Set([...state.layers, ...newLayers]));
    },
    removeLayer: (state, { payload }) => {
      state.layers = state.layers.filter(layer => layer !== payload);
    },
    fetchSourcesSuccess: (state, { payload }) => {
      // Convert from minutes to millliseconds and then half the value.
      // This will ensure we update the token before it expires.
      const { sources, token, timeout } = payload;
      const timeoutInMilliseconds = (timeout * 60 * 1000) / 2;
      state.token = token;
      state.sources = sources;
      state.pollingPeriod = timeoutInMilliseconds;
    },
    fetchSourcesFailure: (state, { payload }) => {
      state.error = payload;
    }
  }
});

export const { addLayers, removeLayer, fetchSourcesFailure, fetchSourcesSuccess } = dataSlice.actions;

export const fetchSources = () => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await getData('/api/data/sources/', headers);
  const data = await response.json();

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;
    // NotificationManager.error(message, 'Fetching Source Data', 50000, () => {});
    return dispatch(fetchSourcesFailure({ message }));
  }

  return dispatch(fetchSourcesSuccess(data));
};

const baseSelector = state => state.data ?? {};
export const selectDataSources = createSelector(baseSelector, state => state.sources ?? []);
export const selectPollingPeriod = createSelector(baseSelector, state => state.pollingPeriod);
export const selectUserLayers = createSelector(baseSelector, state =>
  state.sources ? state.sources.filter(source => state.layers.includes(source.name)) : []
);
export const selectDomainList = createSelector(selectDataSources, sources =>
  Array.from(
    new Set(
      sources.reduce(
        (acc, source) => (source.metadata && source.metadata.domain ? [...acc, source.metadata.domain] : acc),
        []
      )
    )
  )
);

export default dataSlice.reducer;
