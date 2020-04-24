import { createSlice } from '@reduxjs/toolkit';
import { getJsonAuthHeaders, getData } from 'utils/http';

const initialState = {
  layers: [],
  domains: [],
  pollingPeriod: 30000,
  token: null,
  dataSources: null
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addLayers: (state, { payload }) => {
      state.layers = Array.from(new Set([...state.layers, ...payload]));
    },
    removeLayer: (state, { payload }) => {
      state.layers = state.layers.filter(layer => layer.name !== payload.name);
    },
    fetchSourcesSuccess: (state, { payload }) => {
      // Convert from minutes to millliseconds and then half the value.
      // This will ensure we update the token before it expires.
      const { domains, sources, token, timeout } = payload;
      const timeoutInMilliseconds = (timeout * 60 * 1000) / 2;
      state.token = token;
      state.dataSources = sources;
      state.pollingPeriod = timeoutInMilliseconds;
      state.domains = domains;
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

  const domains = Array.from(new Set(data.sources.map(source => source.metadata.domain)));

  return dispatch(fetchSourcesSuccess({ ...data, domains }));
};

export default dataSlice.reducer;
