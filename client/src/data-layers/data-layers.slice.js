import { createSlice, createSelector } from '@reduxjs/toolkit';
import { mergeWith, isEmpty, get } from 'lodash';
import { getJsonAuthHeaders, getData } from 'utils/http';
import { getFilterOptions } from './filters/filters-utils';

const initialState = {
  layers: {},
  pollingPeriod: 30000,
  token: null,
  sources: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addLayers: (state, { payload }) => {
      let newLayers =
        typeof payload[0] === 'object'
          ? payload.map(layer => layer.source_id)
          : payload;
      newLayers.forEach(layer => {
        if (state.layers[layer] && !state.layers[layer].visible)
          state.layers[layer].visible = true;
        else if (!state.layers[layer])
          state.layers[layer] = { loaded: true, visible: true };
      });
    },
    removeLayer: (state, { payload }) => {
      let layerId = typeof payload === 'object' ? payload.source_id : payload;
      if (state.layers[layerId]) state.layers[layerId].visible = false;
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
      state.filters = mergeWith(
        payload,
        state.filters,
        (objValue, srcValue) => {
          if (Array.isArray(objValue) && Array.isArray(srcValue)) {
            return Array.from(new Set([...srcValue, ...objValue]));
          }
        },
      );
    },
    removeFilters: (state, { payload }) => {
      for (let layer of Object.keys(payload)) {
        for (let property of Object.keys(payload[layer])) {
          if (
            payload[layer][property].length === 1 &&
            state.filters[layer][property].length === 1 &&
            state.filters[layer][property][0] === payload[layer][property][0]
          ) {
            delete state.filters[layer][property];
            if (isEmpty(state.filters[layer])) {
              delete state.filters[layer];
              break;
            }
          }
          if (state.filters[layer][property]) {
            state.filters[layer][property] = state.filters[layer][
              property
            ].filter(value => !payload[layer][property].includes(value));
          }
        }
      }
    },
  },
});

export const {
  addLayers,
  removeLayer,
  fetchSourcesFailure,
  fetchSourcesSuccess,
  addFilters,
  removeFilters,
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

const baseSelector = state => state.data ?? {};
export const selectDataToken = createSelector(
  baseSelector,
  state => state.token ?? '',
);
export const selectDataSources = createSelector(
  baseSelector,
  state => state.sources ?? [],
);
export const selectPollingPeriod = createSelector(
  baseSelector,
  state => state.pollingPeriod,
);
export const selectActiveLayers = createSelector(baseSelector, state =>
  state.sources
    ? state.sources.filter(source => state.layers.includes(source.source_id))
    : [],
);
export const selectInactiveLayers = createSelector(baseSelector, state =>
  state.sources
    ? state.sources.filter(source => !state.layers.includes(source.source_id))
    : [],
);
export const selectDomainList = createSelector(selectDataSources, sources =>
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

const createLayerFilters = layer =>
  layer.metadata.filters.reduce(
    (acc, filter) => ({
      ...acc,
      ...getFilterOptions(
        filter,
        layer.data.features.map(feature => feature.properties),
      ),
    }),
    {},
  );

export const selectAvailableFilters = createSelector(
  selectActiveLayers,
  layers => {
    const filters = layers.reduce((acc, layer) => {
      return layer.metadata.filters
        ? { ...acc, [layer.source_id]: createLayerFilters(layer) }
        : acc;
    }, {});
    return filters;
  },
);

export const selectCurrentFilters = createSelector(
  baseSelector,
  state => state.filters ?? {},
);

export const selectFilteredData = createSelector(
  [selectActiveLayers, selectCurrentFilters],
  (layers, filters) => {
    const filteredLayers = JSON.parse(JSON.stringify(layers));
    return filteredLayers.map(layer => {
      if (filters[layer.source_id]) {
        const layerFilters = filters[layer.source_id];
        layer.data.features = layer.data.features.filter(feature => {
          for (let filterPath in layerFilters) {
            if (layerFilters[filterPath].length > 0) {
              const value = get(feature.properties, filterPath);
              if (Array.isArray(value)) {
                if (!value.some(val => layerFilters[filterPath].includes(val)))
                  return false;
              } else if (!layerFilters[filterPath].includes(value))
                return false;
            }
          }
          return true;
        });
      }
      return layer;
    });
  },
);

export default dataSlice.reducer;
