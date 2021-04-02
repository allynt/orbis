import { createSlice, createSelector } from '@reduxjs/toolkit';
import { differenceBy, unionBy, sumBy, get, find } from 'lodash';

import { aggregateValues } from 'analysis-panel/aggregateValues';
import { aggregateTimeSeries } from 'analysis-panel/aggregateTimeSeries';
import { activeDataSourcesSelector } from 'data-layers/data-layers.slice';

/**
 * @typedef {{
 *   clickedFeatures?: import('typings/orbis').PolygonPickedMapFeature[]
 *   property?: import('typings/orbis').Property & {source_id: string}
 * }} IsolationPlusState
 */

/** @type {IsolationPlusState} */
const initialState = {
  property: {
    source_id: undefined,
    name: undefined,
  },
};

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState,
  reducers: {
    setState: (state, { payload }) => {
      state.property = payload?.property || {};
      state.clickedFeatures = payload?.clickedFeatures;
    },
    setProperty: (state, { payload }) => {
      if (state.clickedFeatures?.[0]?.layer?.id !== payload.source_id)
        state.clickedFeatures = undefined;
      state.property = payload;
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
  },
});

export const {
  setState,
  setProperty,
  setClickedFeatures,
  addClickedFeatures,
  removeClickedFeatures,
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

export const populationTotalSelector = createSelector(
  clickedFeaturesSelector,
  clickedFeatures =>
    !clickedFeatures
      ? undefined
      : sumBy(
          clickedFeatures,
          'object.properties.population',
        )?.toLocaleString(),
);

export const householdTotalSelector = createSelector(
  clickedFeaturesSelector,
  clickedFeatures =>
    !clickedFeatures
      ? undefined
      : sumBy(
          clickedFeatures,
          'object.properties.households',
        )?.toLocaleString(),
);

export const categoryListSelector = createSelector(
  [propertySelector, clickedFeaturesSelector],
  (property, clickedFeatures) =>
    !property || !property.categories || !clickedFeatures
      ? undefined
      : Object.entries(property.categories)
          .map(([category, rest]) => {
            const count = clickedFeatures?.reduce(
              (prev, curr) =>
                curr.object.properties[property.name] === category
                  ? prev + 1
                  : prev,
              0,
            );
            const percent = (count / clickedFeatures?.length) * 100;
            return { category, count, percent, ...rest };
          })
          .filter(c => c.count > 0)
          .sort((a, b) => a.category.localeCompare(b.category)),
);

export const aggregationSelector = createSelector(
  [propertySelector, clickedFeaturesSelector],
  (property, clickedFeatures) =>
    !property || !clickedFeatures
      ? undefined
      : aggregateValues(clickedFeatures, property),
);

export const breakdownAggregationSelector = createSelector(
  [
    rootState => propertySelector(rootState?.orbs),
    rootState => clickedFeaturesSelector(rootState?.orbs),
    activeDataSourcesSelector,
  ],
  (selectedProperty, clickedFeatures, activeSources) => {
    if (!selectedProperty || !clickedFeatures) return undefined;
    const source = find(activeSources, {
      source_id: selectedProperty.source_id,
    });

    if (!source) return undefined;

    return selectedProperty?.breakdown
      ?.map(breakdownPropertyName => {
        const breakdownProperty = find(source.metadata.properties, {
          name: breakdownPropertyName,
        });
        if (
          selectedProperty.timeseries &&
          breakdownProperty.timeseries_latest_timestamp !==
            selectedProperty.timeseries_latest_timestamp
        ) {
          console.error(
            `Latest timestamp for property ${breakdownPropertyName} and ${selectedProperty.name} do not match`,
          );
          return { value: 0, name: breakdownPropertyName };
        }
        const value = aggregateValues(clickedFeatures, breakdownProperty);
        return {
          value,
          name: breakdownPropertyName,
        };
      })
      .filter(v => v.value > 0);
  },
);

export const timeSeriesAggregationSelector = createSelector(
  [propertySelector, clickedFeaturesSelector],
  (property, clickedFeatures) =>
    !property || !clickedFeatures
      ? undefined
      : clickedFeatures?.length > 1
      ? aggregateTimeSeries(clickedFeatures, property)
      : get(clickedFeatures?.[0], `object.properties.${property?.name}`),
);

export default isolationPlusSlice.reducer;
