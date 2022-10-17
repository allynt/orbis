/**
 * @typedef {import('typings').GeoJsonFeature} GeoJsonFeature
 */

import { createSelector, createSlice } from '@reduxjs/toolkit';

export const SHARED_STATE_KEY = 'shared';

const TEMP_SHARED_PROPERTY = {
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
        LAD16: {
          min: 62,
          max: 108154,
          clip_min: 389,
          clip_max: 46040,
        },
        LAD19: {
          min: 62,
          max: 108154,
          clip_min: 374,
          clip_max: 46460,
        },
      },
    },
  },
  timeseries: false,
};

/**
 * @typedef {{
 *   [key: string]: {
 *     visible?: boolean,
 *     clickedFeatures?: GeoJsonFeature[]
 *     hoveredFeatures?: GeoJsonFeature[],
 *     filterValue?: any
 *     other?: any
 *     timestamp?: number
 *     data?: any
 *   },
 *   extrudedMode: boolean
 *   extrusionScale: number
 * }} LayersState
 */

/**
 * @template P
 * @typedef {import('@reduxjs/toolkit').CaseReducer<
 *   LayersState,
 *   import('@reduxjs/toolkit').PayloadAction<{
 *   key: string,
 *   } & P>
 * >} GenericOrbAction
 */

/**
 * @typedef {GenericOrbAction<{
 *     filterValue?: any
 *   }>} SetFilterValueAction
 */

/**
 * @typedef {GenericOrbAction<{
 *    other?: any
 * }>} SetOtherAction
 */

/**
 * @typedef {GenericOrbAction<{
 *   data?: any
 * }>} SetDataAction
 */

/** @type {LayersState} */
const initialState = {
  crossFilterShared: {
    other: {
      property: TEMP_SHARED_PROPERTY,
    },
  },
};

const handleMissingKey = () => {
  console.error(
    'payload.key does not exist. Key must be provided to set state',
  );
  return;
};

const layersSlice = createSlice({
  name: 'crossFilterLayers',
  initialState,
  reducers: {
    /** @type {SetFilterValueAction} */
    setFilterValue: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, filterValue } = payload;
      state[key] = { ...state[key], filterValue };
    },
    /** @type {SetOtherAction} */
    setOther: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, other } = payload;
      state[key] = { ...state[key], other };
    },
    /** @type {SetDataAction} */
    setCrossFilterData: (state, { payload }) => {
      if (!payload.key) return handleMissingKey();
      const { key, data } = payload;
      state[key] = { ...state[key], data };
    },
    setState: (_, { payload }) => payload,
  },
});

export const { setCrossFilterData, setFilterValue, setOther, setState } =
  layersSlice.actions;

/**
 * @param {import('./orbReducer').OrbState} orbs
 * @returns {LayersState}
 */
const baseSelector = orbs => orbs?.[layersSlice.name];

export const crossFilterLayersWithDataSelector = createSelector(
  baseSelector,
  state =>
    Object.entries(state ?? {}).reduce(
      (acc, [key, value]) =>
        value != null && typeof value === 'object' && 'data' in value
          ? [...acc, key]
          : acc,
      [],
    ),
);

export const dataSelector = () =>
  createSelector(baseSelector, state => state?.crossfilteringLayerData?.data);

/** @param {string} id */
export const filterValueSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.filterValue);

/** @param {string} id */
export const otherSelector = id =>
  createSelector(baseSelector, state => state?.[id]?.other);

export const crossFilterUrlsSelector = () =>
  createSelector(baseSelector, state => state?.crossFilterShared?.other);

export default layersSlice.reducer;
