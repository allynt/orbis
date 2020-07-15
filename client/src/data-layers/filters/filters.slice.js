import { getFilterOptions } from './filters-utils';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { mergeWith, isEmpty, get } from 'lodash';

const filtersSlice = createSlice({
  name: 'filters',
  reducer: {
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
  state => state.layers,
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
  state => state,
  state => state.filters ?? {},
);

export const selectFilteredData = createSelector(
  [state => state.layers, selectCurrentFilters],
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

export const { addFilters, removeFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
