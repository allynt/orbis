import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import { userSelector } from 'accounts/accounts.selectors';
import apiClient from 'api-client';
import { addLogItem } from 'app.slice';

import { createOrbsWithCategorisedSources } from './categorisation.utils';

/**
 * @typedef DataState
 * @property {import('typings').Source['source_id'][]} layers
 * @property {number} pollingPeriod
 * @property {string} [token]
 * @property {import('typings').Source[]} [sources]
 * @property {any} [error]
 * @property {import('typings').Orb[]} [orbs]
 * @property {Record<string, 'pending' | 'fulfilled' |'rejected'>} requests
 */

const name = 'data';

/** @type {DataState} */
const initialState = {
  layers: [],
  pollingPeriod: 30000,
  token: null,
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
    /**
     * @type {import('@reduxjs/toolkit').CaseReducer<
     *  DataState,
     *  import('@reduxjs/toolkit').PayloadAction<import('typings').Source>
     * >}
     */
    addSource: (state, { payload }) => {
      state.sources.push(payload);
    },
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
        const { sources, token, timeout } = payload;
        const timeoutInMilliseconds = (timeout * 60 * 1000) / 2;
        state.token = token;
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

export const { updateLayers, addSource } = dataSlice.actions;

export const setLayers = sourceIds => async (dispatch, getState) => {
  if (!sourceIds) return;

  const activeLayers = activeLayersSelector(getState());
  const dataSources = dataSourcesSelector(getState());

  const sourceIdsToLog = sourceIds.filter(
    sourceId => !activeLayers.includes(sourceId),
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
};

export const logProperty = (source, property, isOn) => async (
  dispatch,
  getState,
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
};

export const logDataset = source => async (dispatch, getState) => {
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
};

export const logError = source => async (dispatch, getState) => {
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
};

/**
 * @param {import('typings').RootState} state
 */
const baseSelector = state => state?.data;

export const selectDataToken = createSelector(
  baseSelector,
  state => state?.token ?? '',
);

export const dataSourcesSelector = createSelector(
  baseSelector,
  state => state?.sources ?? [],
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

export default dataSlice.reducer;
