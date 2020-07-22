import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getJsonAuthHeaders, getData } from 'utils/http';

const initialState = {
  layers: [],
  pollingPeriod: 30000,
  token: null,
  sources: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addLayers: (state, { payload }) => {
      const newLayers =
        typeof payload[0] === 'object'
          ? payload.map(layer => layer.source_id)
          : payload;
      state.layers = [...state.layers, ...newLayers];
    },
    removeLayer: (state, { payload }) => {
      const layerId = typeof payload === 'object' ? payload.source_id : payload;
      state.layers = state.layers.filter(layer => layer !== layerId);
    },
    setLayers: (state, { payload }) => {
      if (!payload) return;
      const layers =
        typeof payload[0] === 'object'
          ? payload.map(source => source.source_id)
          : payload;
      if (layers.some(layer => layer === undefined)) return;
      state.layers = layers;
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
    },
  },
});

export const {
  addLayers,
  setLayers,
  removeLayer,
  fetchSourcesFailure,
  fetchSourcesSuccess,
} = dataSlice.actions;

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

const baseSelector = state => state?.data ?? {};
export const selectDataToken = createSelector(
  baseSelector,
  state => state.token ?? '',
);

export const dataSourcesSelector = createSelector(
  baseSelector,
  state => state.sources ?? [],
);

export const selectPollingPeriod = createSelector(
  baseSelector,
  state => state.pollingPeriod,
);

export const activeLayersSelector = createSelector(
  baseSelector,
  data => data.layers ?? [],
);

export const activeDataSourcesSelector = createSelector(
  [dataSourcesSelector, activeLayersSelector],
  (sources, layers) =>
    sources ? sources.filter(source => layers.includes(source.source_id)) : [],
);

export const selectDomainList = createSelector(dataSourcesSelector, sources =>
  Array.from(
    new Set(
      sources.reduce(
        (acc, source) =>
          source.metadata && source.metadata.domain
            ? [...acc, source.metadata.domain]
            : acc,
        [],
      ),
    ),
  ),
);

export default dataSlice.reducer;
