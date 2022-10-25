// @ts-nocheck
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

const MOCK_ACTIVE_CROSSFILTERING_PROPERTIES = {
  'astrosat/isolation_plus_core/benefits_breakdown_crossfiltering/dev': [
    {
      name: 'Alternative Claimant Count: Total',
      label: 'Number of unemployment claimants',
      description:
        'The number of people claiming unemployment-related benefits (Alternative Claimant Count). These statistics provide a consistent measure of local levels of unemployed claimants over time and across areas, by modelling what the count would have been if Universal Credit had been in place since 2013 with the broader span of people this covers.',
      source: 'DWP (2020)',
      details:
        'The number of people claiming unemployment-related benefits (Alternative Claimant Count) in August 2020. These statistics provide a consistent measure of local levels of unemployed claimants over time and across areas, by modelling what the count would have been if Universal Credit had been in place since 2013 with the broader span of people this covers. Note the source data are subject to introduced random errors to minimise the risk of identifying individuals: this means that small numbers may not be perfectly accurate.',
      aggregation: 'sum',
      aggregates: {
        GB: 2725862,
        England: 2378698,
        Scotland: 221396,
        Wales: 125768,
      },
      min: 0,
      max: 402,
      clip_min: 0,
      clip_max: 51,
      units: 'persons',
      type: 'continuous',
      precision: 0,
      application: {
        orbis: {
          label: 'Number of unemployment claimants',
          display: {
            colormap_type: 'negative_sequential',
            colormap_reversed: false,
            color: 'YlOrRd',
          },
          data_visualisation_components: [
            {
              name: 'NationalDeviationHistogram',
              props: {
                data: [
                  {
                    x: 20,
                    y: 222215,
                  },
                  {
                    x: 61,
                    y: 5299,
                  },
                  {
                    x: 102,
                    y: 205,
                  },
                  {
                    x: 143,
                    y: 32,
                  },
                  {
                    x: 184,
                    y: 5,
                  },
                  {
                    x: 225,
                    y: 2,
                  },
                  {
                    x: 266,
                    y: 0,
                  },
                  {
                    x: 307,
                    y: 0,
                  },
                  {
                    x: 348,
                    y: 0,
                  },
                  {
                    x: 389,
                    y: 1,
                  },
                ],
                info: 'The bar chart is a histogram describing the full dataset across Great Britain. The height of each bar indicates the number of areas in GB that have values within the width of the bar on the horizontal axis. The yellow line shows where your selected area (or the average of all selected areas) falls in comparison to the rest of GB.',
              },
            },
          ],
          crossfiltering: {
            OA: {
              min: 0,
              max: 402,
              clip_min: 0,
              clip_max: 60,
            },
            LSOA: {
              min: 0,
              max: 591,
              clip_min: 0,
              clip_max: 259,
            },
            MSOA: {
              min: 8,
              max: 1777,
              clip_min: 37,
              clip_max: 1176,
            },
            LAD_2016: {
              min: 74,
              max: 84815,
              clip_min: 293,
              clip_max: 37750,
            },
            LAD_2019: {
              min: 74,
              max: 84815,
              clip_min: 291,
              clip_max: 37809,
            },
          },
        },
      },
    },
    {
      name: 'Alternative Claimant Count: Change',
      label: 'Change in unemployment claimants',
      description:
        'Change in the number of people claiming unemployment-related benefits (Alternative Claimant Count) between February and August 2020. These statistics provide a consistent measure of local levels of unemployed claimants over time and across areas, by modelling what the count would have been if Universal Credit had been in place since 2013 with the broader span of people this covers.',
      source: 'DWP (2020)',
      details:
        'The change in the number of people claiming unemployment-related benefits (Alternative Claimant Count) between February and August 2020. These statistics provide a consistent measure of local levels of unemployed claimants over time and across areas, by modelling what the count would have been if Universal Credit had been in place since 2013 with the broader span of people this covers. Note the source data are subject to introduced random errors to minimise the risk of identifying individuals: this means that small numbers may not be perfectly accurate.',
      aggregation: 'sum',
      aggregates: {
        GB: 1472089,
        England: 1283436,
        Scotland: 126112,
        Wales: 62541,
      },
      min: -31,
      max: 248,
      clip_min: -31,
      clip_max: 31,
      units: 'persons',
      type: 'continuous',
      precision: 0,
      application: {
        orbis: {
          label: 'Change in unemployment claimants',
          display: {
            colormap_type: 'diverging',
            colormap_reversed: true,
            color: 'RdBu',
          },
          data_visualisation_components: [
            {
              name: 'NationalDeviationHistogram',
              props: {
                data: [
                  {
                    x: -25,
                    y: 1,
                  },
                  {
                    x: 3,
                    y: 216279,
                  },
                  {
                    x: 32,
                    y: 11322,
                  },
                  {
                    x: 61,
                    y: 134,
                  },
                  {
                    x: 90,
                    y: 15,
                  },
                  {
                    x: 119,
                    y: 5,
                  },
                  {
                    x: 148,
                    y: 2,
                  },
                  {
                    x: 177,
                    y: 0,
                  },
                  {
                    x: 206,
                    y: 0,
                  },
                  {
                    x: 235,
                    y: 1,
                  },
                ],
                info: 'The bar chart is a histogram describing the full dataset across Great Britain. The height of each bar indicates the number of areas in GB that have values within the width of the bar on the horizontal axis. The yellow line shows where your selected area (or the average of all selected areas) falls in comparison to the rest of GB.',
              },
            },
          ],
          crossfiltering: {
            OA: {
              min: 0,
              max: 402,
              clip_min: 0,
              clip_max: 60,
            },
            LSOA: {
              min: 0,
              max: 591,
              clip_min: 0,
              clip_max: 259,
            },
            MSOA: {
              min: 8,
              max: 1777,
              clip_min: 37,
              clip_max: 1176,
            },
            LAD_2016: {
              min: 74,
              max: 84815,
              clip_min: 293,
              clip_max: 37750,
            },
            LAD_2019: {
              min: 74,
              max: 84815,
              clip_min: 291,
              clip_max: 37809,
            },
          },
        },
      },
    },
  ],
  'astrosat/isolation_plus_core/childpov2019_breakdown_crossfiltering/dev': [
    {
      name: 'Children in low income families: total',
      label: 'Children in low-income families',
      description:
        'The number of children living in relative low income by local area. Relative low-income is defined as a family whose equivalised income is below 60 per cent of contemporary median income. Gross income measure is Before Housing Costs and includes contributions from earnings, state support and pensions.',
      source: 'DWP (2020)',
      details:
        'The number of children living in relative low income by local area in the tax year 2018/19. Relative low-income is defined as a family whose equivalised income is below 60 per cent of contemporary median income. Gross income measure is Before Housing Costs and includes contributions from earnings, state support and pensions. A family must have claimed one or more of Universal Credit, Tax Credits or Housing Benefit at any point in the year to be classed as low income in these statistics. For the purposes of the breakdown statistics, working families are those in which either the adult claimant of Child Benefit or any partners have an accumulated period of at least 26 weeks paid employment or self-employment within the tax year. Note the source data are subject to introduced random errors to minimise the risk of identifying individuals: this means that small numbers may not be perfectly accurate, and in some cases therefore the breakdown statistics do not add up to the total.',
      aggregation: 'sum',
      aggregates: {
        GB: 2731684,
        England: 2415908,
        Scotland: 190752,
        Wales: 125024,
      },
      breakdown: ['Working families', 'Non-working families'],
      min: 0,
      max: 327,
      clip_min: 0,
      clip_max: 74,
      precision: 0,
      units: 'persons',
      type: 'continuous',
      application: {
        orbis: {
          label: 'Children in low-income families',
          display: {
            colormap_type: 'negative_sequential',
            colormap_reversed: false,
            color: 'YlOrRd',
          },
          data_visualisation_components: [
            {
              name: 'NationalDeviationHistogram',
              props: {
                data: [
                  {
                    x: 16,
                    y: 210508,
                  },
                  {
                    x: 49,
                    y: 14113,
                  },
                  {
                    x: 82,
                    y: 2217,
                  },
                  {
                    x: 115,
                    y: 689,
                  },
                  {
                    x: 148,
                    y: 186,
                  },
                  {
                    x: 181,
                    y: 31,
                  },
                  {
                    x: 214,
                    y: 10,
                  },
                  {
                    x: 247,
                    y: 3,
                  },
                  {
                    x: 280,
                    y: 1,
                  },
                  {
                    x: 313,
                    y: 1,
                  },
                ],
                info: 'The bar chart is a histogram describing the full dataset across Great Britain. The height of each bar indicates the number of areas in GB that have values within the width of the bar on the horizontal axis. The yellow line shows where your selected area (or the average of all selected areas) falls in comparison to the rest of GB.',
              },
            },
            {
              name: 'PropertyBreakdownChart',
              props: {
                info: 'The pie chart shows a breakdown of the data summed over all selected areas. Segment size indicates number of children by family work status',
              },
            },
          ],
          crossfiltering: {
            OA: {
              min: 0,
              max: 327,
              clip_min: 0,
              clip_max: 92,
            },
            LSOA: {
              min: 0,
              max: 808,
              clip_min: 0,
              clip_max: 404,
            },
            MSOA: {
              min: 0,
              max: 3182,
              clip_min: 21,
              clip_max: 1798,
            },
            LAD_2016: {
              min: 62,
              max: 108154,
              clip_min: 389,
              clip_max: 46040,
            },
            LAD_2019: {
              min: 62,
              max: 108154,
              clip_min: 374,
              clip_max: 46460,
            },
          },
        },
      },
      timeseries: false,
    },
  ],
};

/**
 * @typedef DataState
 * @property {import('typings').Source['source_id'][]} layers
 * @property {boolean} isCrossFilteringMode
 * @property {import('typings').Source['source_id'][]} crossFilterLayers
 * @property {string} crossFilteringCommonGeometry
 * @property {object} activeCrossFilteringProperties
 * @property {number} pollingPeriod
 * @property {object[]} [tokens]
 * @property {import('typings').Source[]} [sources]
 * @property {import('typings').Source[]} [crossFilterableSources]
 * @property {any} [error]
 * @property {import('typings').Orb[]} [orbs]
 * @property {Record<string, 'pending' | 'fulfilled' |'rejected'>} requests
 */

const name = 'data';

/** @type {DataState} */
const initialState = {
  layers: [],
  isCrossFilteringMode: false,
  crossFilterLayers: [
    'astrosat/isolation_plus_core/childpov2019_breakdown_crossfiltering/dev',
    'astrosat/isolation_plus_core/benefits_breakdown_crossfiltering/dev',
  ],
  // crossFilteringCommonGeometry: 'LAD_2019',
  // crossFilteringCommonGeometry: 'LAD_2016',
  // crossFilteringCommonGeometry: 'LSOA',
  crossFilteringCommonGeometry: 'MSOA',
  // crossFilteringCommonGeometry: 'OA',
  // activeCrossFilteringProperties: {},
  activeCrossFilteringProperties: MOCK_ACTIVE_CROSSFILTERING_PROPERTIES,
  pollingPeriod: 30000,
  tokens: null,
  sources: null,
  crossFilterableSources: null,
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
  `${name}/setCrossFilterLayers`,
  async (sourceIds, { rejectWithValue, dispatch, getState }) => {
    try {
      if (!sourceIds) return;

      const activeCrossFilterLayers = activeCrossFilteringLayersSelector(
        getState(),
      );
      const crossFilterDataSources = crossFilterableDataSourcesSelector(
        getState(),
      );
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
    setIsCrossFilteringMode: (state, { payload }) => {
      state.isCrossFilteringMode = payload;
    },
    updateCrossFilterLayers: (state, { payload }) => {
      if (!payload) return;
      const layers =
        typeof payload[0] === 'object'
          ? payload.map(source => source.source_id)
          : payload;
      if (layers.some(layer => layer === undefined)) return;

      state.crossFilterLayers = layers;
    },
    setCrossFilterSelectedProperties: (state, { payload }) => {
      state.activeCrossFilteringProperties = payload;
    },
    setCrossFilteringCommonGeometry: (state, { payload }) => {
      state.crossFilteringCommonGeometry = payload;
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

        state.crossFilterableSources = sources
          .filter(
            source => source?.metadata?.application?.orbis?.crossfiltering,
          )
          .map(source => {
            const filterableProperties = source.metadata.properties.filter(
              property => property.application.orbis.crossfiltering,
            );

            return {
              ...source,
              properties: filterableProperties,
            };
          });
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
  setCrossFilteringCommonGeometry,
  setCrossFilterSelectedProperties,
} = dataSlice.actions;

/**
 * @param {import('typings').RootState} state
 */
const baseSelector = state => state?.data;

export const selectDataToken = createSelector(
  baseSelector,
  state => state?.tokens ?? null,
);

export const isCrossFilteringModeSelector = createSelector(
  baseSelector,
  state => state?.isCrossFilteringMode,
);

export const dataSourcesSelector = createSelector(
  baseSelector,
  state => state?.sources ?? [],
);

export const crossFilterableDataSourcesSelector = createSelector(
  baseSelector,
  state => state?.crossFilterableSources ?? [],
);

export const crossFilteringCommonGeometrySelector = createSelector(
  baseSelector,
  state => state?.crossFilteringCommonGeometry ?? null,
);

export const activeCrossFilterPropertiesSelector = createSelector(
  baseSelector,
  state => state?.activeCrossFilteringProperties,
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
  [crossFilterableDataSourcesSelector, activeCrossFilteringLayersSelector],
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
