import { sumBy } from 'lodash';

import { getValueForTimestamp } from 'utils/data';

import { DEFAULT_DECIMAL_PRECISION } from '../map/map.constants';

/**
 * Aggregates the values for a certain property of all clicked features
 * using the aggregation method as specified by the property
 *
 * @param {any[]} clickedFeatures
 * @param {Partial<import('typings/orbis').ContinuousProperty>} selectedProperty
 * @param {number} [selectedTimestamp]
 */
export const aggregateValues = (
  clickedFeatures,
  selectedProperty,
  selectedTimestamp,
) => {
  if (!clickedFeatures || !selectedProperty) return 0;
  if (
    clickedFeatures.some(
      feature => !(`${selectedProperty.name}` in feature.object.properties),
    )
  )
    console.error(
      `Could not find property ${selectedProperty.name} in clickedFeatures during aggregateValues.
      This may be due to a spelling or formatting mistake
      `,
    );

  const sumValue = sumBy(
    clickedFeatures,
    selectedProperty.timeseries
      ? clickedFeature =>
          getValueForTimestamp(
            clickedFeature.object.properties[selectedProperty.name],
            selectedTimestamp ?? selectedProperty?.timeseries_latest_timestamp,
          )
      : `object.properties.${selectedProperty.name}`,
  );

  if (selectedProperty.aggregation === 'mean') {
    const meanValue = sumValue / clickedFeatures.length;
    return +meanValue.toFixed(
      selectedProperty.precision || DEFAULT_DECIMAL_PRECISION,
    );
  }

  return +sumValue?.toFixed?.(
    selectedProperty.precision || DEFAULT_DECIMAL_PRECISION,
  );
};
