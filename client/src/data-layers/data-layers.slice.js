import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getJsonAuthHeaders, getData } from 'utils/http';
import { createHierarchy, injectSource } from './categorisation.utils';

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
      state.layers = Array.from(new Set([...state.layers, ...newLayers]));
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

/**
 * @type {import('@reduxjs/toolkit').Selector<any, string>}
 */
export const selectDataToken = createSelector(
  baseSelector,
  state => state.token ?? '',
);

/**
 * @type {import('@reduxjs/toolkit').Selector<any, Source[]>}
 */
export const dataSourcesSelector = createSelector(
  baseSelector,
  state => state.sources ?? [],
);

/**
 * @type {import('@reduxjs/toolkit').Selector<any, number>}
 */
export const selectPollingPeriod = createSelector(
  baseSelector,
  state => state.pollingPeriod,
);

/**
 * @type {import('@reduxjs/toolkit').Selector<any, Source['source_id'][]>}
 */
export const activeLayersSelector = createSelector(
  baseSelector,
  data => data.layers ?? [],
);

/**
 * @type {import('@reduxjs/toolkit').Selector<any, Source[]>}
 */
export const activeDataSourcesSelector = createSelector(
  [dataSourcesSelector, activeLayersSelector],
  (sources, layers) =>
    sources ? sources.filter(source => layers.includes(source.source_id)) : [],
);

/**
 * @type {import('@reduxjs/toolkit').Selector<any, string[]>}
 */
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

/**
 * @param {Category} category
 * @param {string} currentPath
 * @returns {string}
 */
const createPath = (category, currentPath) => {
  if (category.child)
    return createPath(
      category.child,
      currentPath ? `${currentPath}.${category.name}` : category.name,
    );
  return `${currentPath}.${category.name}`;
};

/**
 * @param {Source} source
 */
const orbisMetadataSelector = source => source?.metadata?.application?.orbis;

/**
 * @type {import('@reduxjs/toolkit').Selector<any, import('./data-layers-dialog/data-layers-dialog.component').Orb[]>}
 */
export const categorisedSourcesSelector = createSelector(
  dataSourcesSelector,
  sources =>
    sources.reduce(
      /**
       * @param {import('./data-layers-dialog/data-layers-dialog.component').Orb[]} orbs
       */
      (orbs, source) => {
        const applicationMetadata = orbisMetadataSelector(source);
        const categorisationPath = createPath(
          applicationMetadata.categories,
          applicationMetadata.orbs[0].name,
        );
        const [name, ...categories] = categorisationPath.split('.');
        const existingOrb = orbs.find(orb => orb.name === name);
        if (existingOrb) {
          const injectedSources = injectSource(
            existingOrb.sources,
            source,
            categories,
          );
          const existingOrbIndex = orbs.indexOf(existingOrb);
          let newOrbs = orbs;
          newOrbs[existingOrbIndex] = {
            ...existingOrb,
            sources: injectedSources,
          };
          return newOrbs;
        }
        const sources = createHierarchy(source, categories.reverse());
        const orb = {
          name,
          // description: applicationMetadata.orbs[0].description,
          sources,
        };
        return [...orbs, orb];
      },
      [],
    ),
);

export default dataSlice.reducer;
