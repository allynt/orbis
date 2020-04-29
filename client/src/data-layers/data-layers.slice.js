import { createSlice, createSelector } from '@reduxjs/toolkit';
import { mergeWith } from 'lodash';
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
      let newLayers = payload;
      if (typeof payload[0] === 'object') newLayers = payload.map(layer => layer.name);
      state.layers = Array.from(new Set([...state.layers, ...newLayers]));
    },
    removeLayer: (state, { payload }) => {
      let layerName = payload;
      if (typeof payload === 'object') layerName = payload.name;
      state.layers = state.layers.filter(layer => layer !== layerName);
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
    addFilters: (state, { payload }) => {
      state.filters = mergeWith(payload, state.filters, (objValue, srcValue) => {
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return Array.from(new Set([...srcValue, ...objValue]));
        }
      });
    },
  },
});

export const { addLayers, removeLayer, fetchSourcesFailure, fetchSourcesSuccess, addFilters } = dataSlice.actions;

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
export const selectDataToken = createSelector(baseSelector, state => state.token ?? '');
export const selectDataSources = createSelector(baseSelector, state => state.sources ?? []);
export const selectPollingPeriod = createSelector(baseSelector, state => state.pollingPeriod);
export const selectUserLayers = createSelector(baseSelector, state =>
  state.sources ? state.sources.filter(source => state.layers.includes(source.name)) : [],
);
export const selectNonUserLayers = createSelector(baseSelector, state =>
  state.sources ? state.sources.filter(source => !state.layers.includes(source.name)) : [],
);
export const selectDomainList = createSelector(selectDataSources, sources =>
  Array.from(
    new Set(
      sources.reduce(
        (acc, source) => (source.metadata && source.metadata.domain ? [...acc, source.metadata.domain] : acc),
        [],
      ),
    ),
  ),
);

const createLayerFilters = layer => {
  const filters = layer.metadata.filters.reduce((acc, filter) => {
    const options = new Set();
    for (let feature of layer.data.features) {
      feature.properties[filter] && options.add(feature.properties[filter]);
    }
    return options.size ? { ...acc, [filter]: Array.from(options) } : acc;
  }, {});
  return filters;
};

export const selectAvailableFilters = createSelector(selectUserLayers, layers => {
  const filters = layers.reduce((acc, layer) => {
    return layer.metadata.filters ? { ...acc, [layer.name]: createLayerFilters(layer) } : acc;
  }, {});
  return filters;
});

export const selectCurrentFilters = createSelector(baseSelector, state => state.filters ?? {});

export const selectFilteredData = createSelector([selectUserLayers, selectCurrentFilters], (layers, filters) => {
  const filteredLayers = JSON.parse(JSON.stringify(layers));
  return filteredLayers.map(layer => {
    if (filters[layer.name]) {
      const layerFilters = filters[layer.name];
      layer.data.features = layer.data.features.filter(feature => {
        for (let property in layerFilters) {
          if (!layerFilters[property].includes(feature.properties[property])) return false;
        }
        return true;
      });
    }
    return layer;
  });
});

export default dataSlice.reducer;
