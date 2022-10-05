import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { find } from 'lodash';
import { NotificationManager } from 'react-notifications';

import { userSelector } from 'accounts/accounts.selectors';
import apiClient from 'api-client';
import { addLogItem } from 'app.slice';

import { createOrbsWithCategorisedSources } from './categorisation.utils';

/**
 * @typedef DataState
 * @property {import('typings').Source['source_id'][]} layers
 * @property {boolean} isCrossFilteringMode
 * @property {import('typings').Source['source_id'][]} crossFilterLayers
 * @property {number} pollingPeriod
 * @property {object[]} [tokens]
 * @property {import('typings').Source[]} [sources]
 * @property {any} [error]
 * @property {import('typings').Orb[]} [orbs]
 * @property {Record<string, 'pending' | 'fulfilled' |'rejected'>} requests
 */

const name = 'data';

/** @type {DataState} */
const initialState = {
  layers: [],
  isCrossFilteringMode: false,
  crossFilterLayers: [],
  pollingPeriod: 30000,
  tokens: null,
  sources: null,
  error: null,
  requests: {},
};

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  import('typings').Orb[],
 *  undefined,
 *  {rejectValue: {message: string}, state: import('typings').RootState}
 * >}
 */
export const fetchOrbs = createAsyncThunk(
  `${name}/fetchOrbs`,
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.orbs.getOrbs();
    } catch (error) {
      const { status, message } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Fetching Orbs Error - ${message}`,
        50000,
        () => {},
      );
      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
  {
    condition: (_, { getState }) => {
      const {
        data: { requests },
      } = getState();
      return requests?.fetchOrbs !== 'pending';
    },
  },
);

export const fetchSources = createAsyncThunk(
  `${name}/fetchSources`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  {
   *    sources: import('typings').Source[];
   *    token: string;
   *    timeout: number;
   *  },
   *  never,
   *  { rejectValue: {message: string}, state: import('react-redux').DefaultRootState }
   * >}
   */
  async (_, { rejectWithValue }) => {
    try {
      const sources = await apiClient.data.getSources();
      return sources;
    } catch (error) {
      const message = `${error.status} ${error.message}`;
      return rejectWithValue({ message });
    }
  },
  {
    condition: (_, { getState }) => {
      const {
        data: { requests },
      } = getState();
      return requests?.fetchSources !== 'pending';
    },
  },
);

export const setLayers = createAsyncThunk(
  `${name}/setLayers`,
  async (sourceIds, { rejectWithValue, dispatch, getState }) => {
    try {
      if (!sourceIds) return;

      const activeLayers = activeLayersSelector(getState());
      const dataSources = dataSourcesSelector(getState());
      const sourceIdsToLog = sourceIds.filter(
        sourceId => !activeLayers.includes(sourceId.source_id), // TODO: find out proper data shape...?
      );

      sourceIdsToLog.forEach(sourceId => {
        const matchedDataSource = dataSources.find(
          dataSource => dataSource.source_id === sourceId,
        );

        if (
          !matchedDataSource.metadata.request_strategy &&
          matchedDataSource.metadata.request_strategy !== 'manual'
        ) {
          dispatch(logDataset({ source_id: sourceId }));
        }
      });

      dispatch(updateLayers(sourceIds));
    } catch (error) {
      const message = `${error.status} ${error.message}`;
      return rejectWithValue({ message });
    }
  },
);

export const setCrossFilterLayers = createAsyncThunk(
  `${name}/setLayers`,
  async (sourceIds, { rejectWithValue, dispatch, getState }) => {
    try {
      if (!sourceIds) return;

      const activeCrossFilterLayers = activeCrossFilteringLayersSelector(
        getState(),
      );
      const crossFilterDataSources = crossFilterDataSourcesSelector(getState());
      const sourceIdsToLog = sourceIds.filter(
        sourceId => !activeCrossFilterLayers.includes(sourceId.source_id), // TODO: find out proper data shape...?
      );

      sourceIdsToLog.forEach(sourceId => {
        const matchedDataSource = crossFilterDataSources.find(
          dataSource => dataSource.source_id === sourceId,
        );

        if (
          !matchedDataSource.metadata.request_strategy &&
          matchedDataSource.metadata.request_strategy !== 'manual'
        ) {
          dispatch(logDataset({ source_id: sourceId }));
        }
      });

      dispatch(updateCrossFilterLayers(sourceIds));
    } catch (error) {
      const message = `${error.status} ${error.message}`;
      return rejectWithValue({ message });
    }
  },
);

export const logProperty = createAsyncThunk(
  `${name}/logProperty`,
  async (
    { source, property, isOn },
    { rejectWithValue, dispatch, getState },
  ) => {
    const user = userSelector(getState());

    dispatch(
      addLogItem({
        content: {
          type: 'orbisUserAction',
          orbisUserAction: {
            action: 'toggleProperty',
            userId: user?.id,
            customerId: user?.customers[0]?.id,
            customerName: user?.customers[0]?.name,
            toggleProperty: {
              layer: source.source_id,
              property: property,
              state: isOn,
            },
          },
        },
        tags: ['TOGGLE_PROPERTY', source.source_id, property],
      }),
    );
  },
);

export const logDataset = createAsyncThunk(
  `${name}/logProperty`,
  async (source, { rejectWithValue, dispatch, getState }) => {
    const user = userSelector(getState());

    dispatch(
      addLogItem({
        content: {
          type: 'orbisUserAction',
          orbisUserAction: {
            action: 'loadLayer',
            userId: user?.id,
            customerId: user?.customers[0]?.id,
            customerName: user?.customers[0]?.name,
            loadLayer: {
              dataset: source.source_id,
            },
          },
        },
        tags: ['LOAD_LAYER', source.source_id],
      }),
    );
  },
);

export const logError = createAsyncThunk(
  `${name}/logError`,
  async (source, { rejectWithValue, dispatch, getState }) => {
    const user = userSelector(getState());

    dispatch(
      addLogItem({
        content: {
          type: 'orbisClientError',
          orbisClientError: {
            error: 'loadLayerError',
            userId: user?.id,
            customerId: user?.customers[0]?.id,
            customerName: user?.customers[0]?.name,
            loadLayerError: {
              dataset: source.source_id,
            },
          },
        },
        tags: ['LOAD_LAYER_ERROR', source.source_id],
      }),
    );
  },
);

const dataSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateLayers: (state, { payload }) => {
      if (!payload) return;
      const layers =
        typeof payload[0] === 'object'
          ? payload.map(source => source.source_id)
          : payload;
      if (layers.some(layer => layer === undefined)) return;

      state.layers = layers;
    },
    setIsCrossFilteringMode: (state, { payload }) =>
      (state.isCrossFilteringMode = payload),
    updateCrossFilterLayers: (state, { payload }) => {
      if (!payload) return;
      const layers =
        typeof payload[0] === 'object'
          ? payload.map(source => source.source_id)
          : payload;
      if (layers.some(layer => layer === undefined)) return;

      state.layers = layers;
    },
    /**
     * @type {import('@reduxjs/toolkit').CaseReducer<
     *  DataState,
     *  import('@reduxjs/toolkit').PayloadAction<import('typings').Source>
     * >}
     */
    addSource: (state, { payload }) => {
      state.sources.push(payload);
    },
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSources.pending, state => {
        state.requests = {
          ...state.requests,
          fetchSources: 'pending',
        };
      })
      .addCase(fetchSources.fulfilled, (state, { payload }) => {
        // Convert from minutes to millliseconds and then half the value.
        // This will ensure we update the token before it expires.
        const { sources, tokens, timeout } = payload;
        const timeoutInMilliseconds = (timeout * 60 * 1000) / 2;
        state.tokens = tokens;
        state.sources = sources;
        state.pollingPeriod = timeoutInMilliseconds;
        state.requests = {
          ...state.requests,
          fetchSources: 'fulfilled',
        };
      })
      .addCase(fetchSources.rejected, (state, { payload }) => {
        state.error = payload;
        state.requests = {
          ...state.requests,
          fetchSources: 'rejected',
        };
      });
    builder.addCase(fetchOrbs.pending, state => {
      state.requests = {
        ...state.requests,
        fetchOrbs: 'pending',
      };
    });
    builder.addCase(fetchOrbs.fulfilled, (state, { payload }) => {
      state.orbs = payload;
      state.requests = {
        ...state.requests,
        fetchOrbs: 'fulfilled',
      };
    });
    builder.addCase(fetchOrbs.rejected, (state, { payload }) => {
      state.error = payload;
      state.requests = {
        ...state.requests,
        fetchOrbs: 'rejected',
      };
    });
  },
});

export const {
  reset,
  updateLayers,
  addSource,
  setIsCrossFilteringMode,
  updateCrossFilterLayers,
} = dataSlice.actions;

/**
 * @param {import('typings').RootState} state
 */
const baseSelector = state => state?.data;

export const selectDataToken = createSelector(
  baseSelector,
  state => state?.tokens ?? null,
);

export const dataSourcesSelector = createSelector(
  baseSelector,
  state => state?.sources ?? [],
);

export const crossFilterDataSourcesSelector = createSelector(
  dataSourcesSelector,
  dataSources => {
    const filterableDataSources = dataSources
      .filter(source => source.metadata.application.orbis.crossfiltering)
      .map(source => {
        const filterableProperties = source.metadata.properties.filter(
          property => property.application.orbis.crossfiltering,
        );

        return {
          ...source,
          properties: filterableProperties,
        };
      });

    return filterableDataSources ?? [];
  },
);

export const dashboardSourcesSelector = createSelector(
  dataSourcesSelector,
  state =>
    state?.filter(
      source => !!source?.metadata?.application?.orbis?.dashboard_component,
    ),
);

export const orbsSelector = createSelector(baseSelector, state => state?.orbs);

export const selectPollingPeriod = createSelector(
  baseSelector,
  state => state?.pollingPeriod,
);

export const activeLayersSelector = createSelector(
  baseSelector,
  data => data?.layers ?? [],
);

export const activeCrossFilteringLayersSelector = createSelector(
  baseSelector,
  data => data?.crossFilterLayers ?? [],
);

export const activeDataSourcesSelector = createSelector(
  [dataSourcesSelector, activeLayersSelector],
  (sources, layers) =>
    sources ? sources.filter(source => layers.includes(source.source_id)) : [],
);

export const activeCrossFilterDataSourcesSelector = createSelector(
  [crossFilterDataSourcesSelector, activeCrossFilteringLayersSelector],
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

/**
 * @param {number} [depth]
 * @param {boolean} [ignoreMultipleOrbs]
 */
export const categorisedOrbsAndSourcesSelector = (depth, ignoreMultipleOrbs) =>
  createSelector(dataSourcesSelector, sources =>
    createOrbsWithCategorisedSources(sources, depth, ignoreMultipleOrbs),
  );

/**
 * @param {number} [depth]
 * @param {boolean} [ignoreMultipleOrbs]
 */
export const activeCategorisedOrbsAndSourcesSelector = (
  depth,
  ignoreMultipleOrbs,
) =>
  createSelector(activeDataSourcesSelector, sources =>
    createOrbsWithCategorisedSources(sources, depth, ignoreMultipleOrbs),
  );

/**
 * @param {number} [depth]
 * @param {boolean} [ignoreMultipleOrbs]
 */
export const activeCategorisedSourcesSelector = (depth, ignoreMultipleOrbs) =>
  createSelector(
    activeCategorisedOrbsAndSourcesSelector(depth, ignoreMultipleOrbs),
    orbsAndSources => orbsAndSources.flatMap(orb => orb.sources),
  );

/**
 * @param {number} [depth]
 * @param {boolean} [ignoreMultipleOrbs]
 */
export const activeCrossFilteringCategorisedOrbsAndSourcesSelector = (
  depth,
  ignoreMultipleOrbs,
) =>
  createSelector(activeCrossFilterDataSourcesSelector, sources =>
    createOrbsWithCategorisedSources(sources, depth, ignoreMultipleOrbs),
  );

/**
 * @param {number} [depth]
 * @param {boolean} [ignoreMultipleOrbs]
 */
export const activeCrossFilteringCategorisedSourcesSelector = (
  depth,
  ignoreMultipleOrbs,
) =>
  createSelector(
    activeCrossFilteringCategorisedOrbsAndSourcesSelector(
      depth,
      ignoreMultipleOrbs,
    ),
    orbsAndSources => orbsAndSources.flatMap(orb => orb.sources),
  );

/**
 * @param {import('typings').Source['source_id']} source_id
 */
export const dataSourceByIdSelector = source_id => {
  return createSelector(baseSelector, state =>
    find(state?.sources, { source_id }),
  );
};

export default dataSlice.reducer;
