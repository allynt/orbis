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
 * @property {import('typings/orbis').Source['source_id'][]} layers
 * @property {number} pollingPeriod
 * @property {string} [token]
 * @property {import('typings/orbis').Source[]} [sources]
 * @property {any} [error]
 * @property {import('typings/orbis').Orb[]} [orbs]
 * @property {boolean} isFetchingOrbs
 * @property {string} [fetchOrbsRequestId]
 */

const name = 'data';

/** @type {DataState} */
const initialState = {
  layers: [],
  pollingPeriod: 30000,
  token: null,
  sources: null,
  error: null,
  isFetchingOrbs: false,
  fetchOrbsRequestId: undefined,
};

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  import('typings/orbis').Orb[],
 *  undefined,
 *  {rejectValue: {message: string}, state: import('react-redux').DefaultRootState}
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
        data: { isFetchingOrbs, fetchOrbsRequestId },
      } = getState();
      if (isFetchingOrbs && !!fetchOrbsRequestId) return false;
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
  extraReducers: builder => {
    builder.addCase(fetchOrbs.pending, (state, action) => {
      state.isFetchingOrbs = true;
      state.fetchOrbsRequestId = action.meta.requestId;
    });
    builder.addCase(fetchOrbs.fulfilled, (state, { payload }) => {
      state.orbs = payload;
      state.isFetchingOrbs = false;
      state.fetchOrbsRequestId = undefined;
    });
    builder.addCase(fetchOrbs.rejected, (state, { payload }) => {
      state.error = payload;
      state.isFetchingOrbs = false;
      state.fetchOrbsRequestId = undefined;
    });
  },
});

export const {
  updateLayers,
  fetchSourcesFailure,
  fetchSourcesSuccess,
} = dataSlice.actions;

export const fetchSources = () => async dispatch => {
  try {
    const sources = await apiClient.data.getSources();
    return dispatch(fetchSourcesSuccess(sources));
  } catch (error) {
    const message = `${error.status} ${error.message}`;
    return dispatch(fetchSourcesFailure({ message }));
  }
};

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
 * @param {import('react-redux').DefaultRootState} state
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
 */
export const categorisedOrbsAndSourcesSelector = depth =>
  createSelector(dataSourcesSelector, sources =>
    createOrbsWithCategorisedSources(sources, depth),
  );

/**
 * @param {number} [depth]
 */
export const activeCategorisedOrbsAndSourcesSelector = depth =>
  createSelector(activeDataSourcesSelector, sources =>
    createOrbsWithCategorisedSources(sources, depth),
  );

/**
 * @param {number} [depth]
 */
export const activeCategorisedSourcesSelector = depth =>
  createSelector(
    activeCategorisedOrbsAndSourcesSelector(depth),
    orbsAndSources =>
      orbsAndSources.reduce((prev, orb) => [...prev, ...orb.sources], []),
  );

export default dataSlice.reducer;
