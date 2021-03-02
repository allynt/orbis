import { createSlice, createSelector } from '@reduxjs/toolkit';
import { differenceBy, unionBy, sumBy, get } from 'lodash';

import { aggregateValues } from 'analysis-panel/aggregateValues';
import { aggregateTimeSeries } from 'analysis-panel/aggregateTimeSeries';

/**
 * @typedef {{
 *   clickedFeatures?: import('typings/orbis').PolygonPickedMapFeature[]
 *   property?: import('typings/orbis').Property & {source_id: string}
 *   filterRange?: [number, number]
 *   screenshot?: Blob
 * }} IsolationPlusState
 */

/** @type {IsolationPlusState} */
const initialState = {
  property: {
    source_id: undefined,
    name: undefined,
  },
  filterRange: [undefined, undefined],
  screenshot: undefined,
};

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState,
  reducers: {
    setState: (state, { payload }) => {
      state.property = payload?.property || {};
      state.filterRange = payload?.filterRange || [
        payload?.property?.min,
        payload?.property.max,
      ];
      state.clickedFeatures = payload?.clickedFeatures;
    },
    setProperty: (state, { payload }) => {
      if (state.clickedFeatures?.[0]?.layer?.id !== payload.source_id)
        state.clickedFeatures = undefined;
      state.property = payload;
      state.filterRange = [payload.min, payload.max];
    },
    setClickedFeatures: (state, { payload }) => {
      state.clickedFeatures = payload;
    },
    /**
     * @type {import('@reduxjs/toolkit').CaseReducer<
     *   IsolationPlusState,
     *   import('@reduxjs/toolkit').PayloadAction<import('typings/orbis').PolygonPickedMapFeature[]>
     * >}
     */
    addClickedFeatures: (state, { payload }) => {
      state.clickedFeatures = unionBy(
        state.clickedFeatures,
        payload,
        `object.properties.${payload[0].layer.props.uniqueIdProperty}`,
      );
    },
    /**
     * @type {import('@reduxjs/toolkit').CaseReducer<
     *   IsolationPlusState,
     *   import('@reduxjs/toolkit').PayloadAction<import('typings/orbis').PolygonPickedMapFeature[]>
     * >}
     * */
    removeClickedFeatures: (state, { payload }) => {
      const newFeatures = differenceBy(
        state.clickedFeatures,
        payload,
        `object.properties.${payload[0].layer.props.uniqueIdProperty}`,
      );
      state.clickedFeatures = newFeatures.length ? newFeatures : undefined;
    },
    setFilterRange: (state, { payload }) => {
      state.filterRange = payload;
    },
    setScreenshot: (state, { payload }) => {
      state.screenshot = payload;
    },
  },
});

export const {
  setState,
  setProperty,
  setClickedFeatures,
  addClickedFeatures,
  removeClickedFeatures,
  setFilterRange,
  setScreenshot,
} = isolationPlusSlice.actions;

/**
 * @param {import('../orbReducer').OrbState} orbs
 * @returns {IsolationPlusState}
 */
const baseSelector = orbs => orbs?.[isolationPlusSlice.name];

export const propertySelector = createSelector(
  baseSelector,
  orb => orb?.property,
);

export const clickedFeaturesSelector = createSelector(
  baseSelector,
  orb => orb?.clickedFeatures,
);

export const filterRangeSelector = createSelector(
  baseSelector,
  orb => orb?.filterRange,
);

export const screenshotSelector = createSelector(
  baseSelector,
  orb => orb?.screenshot,
);

export const areasOfInterestSelector = createSelector(
  clickedFeaturesSelector,
  clickedFeatures =>
    clickedFeatures?.map(feat => feat.object.properties.area_name),
);

export const populationAndHouseholdSelector = createSelector(
  clickedFeaturesSelector,
  clickedFeatures => {
    return {
      populationTotal: sumBy(
        clickedFeatures,
        'object.properties.population',
      )?.toLocaleString(),
      householdTotal: sumBy(
        clickedFeatures,
        'object.properties.households',
      )?.toLocaleString(),
    };
  },
);

export const aggregationSelector = createSelector(
  [propertySelector, clickedFeaturesSelector],
  (property, clickedFeatures) => {
    return {
      aggregationLabel: property?.aggregation === 'sum' ? 'Sum' : 'Average',
      areaValue: aggregateValues(clickedFeatures, property),
    };
  },
);

export const breakdownAggregationSelector = createSelector(
  [propertySelector, clickedFeaturesSelector],
  (property, clickedFeatures) =>
    property?.breakdown?.map(name => {
      const value = aggregateValues(clickedFeatures, {
        name,
        aggregation: property.aggregation,
        precision: property.precision,
      });
      return {
        value,
        name,
      };
    }),
);

export const timeSeriesAggregationSelector = createSelector(
  [propertySelector, clickedFeaturesSelector],
  (property, clickedFeatures) =>
    clickedFeatures?.length > 1
      ? aggregateTimeSeries(clickedFeatures, property)
      : get(clickedFeatures?.[0], `object.properties.${property?.name}`),
);

export default isolationPlusSlice.reducer;
