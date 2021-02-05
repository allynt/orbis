import { sumBy } from 'lodash';
import { defaultDecimalPrecision } from '../map/map.constants';

/**
 * Aggregates the values for a certain property of all clicked features
 * using the aggregation method as specified by the property
 *
 * @param {any[]} clickedFeatures
 * @param {Partial<import('typings/orbis').Property>} selectedProperty
 */
export const aggregateValues = (clickedFeatures, selectedProperty) => {
  if (!clickedFeatures || !selectedProperty) return 0;

  const sumValue = sumBy(
    clickedFeatures,
    `object.properties.${selectedProperty?.name}`,
  );

  if (selectedProperty?.aggregation === 'mean') {
    const meanValue = sumValue / clickedFeatures?.length;
    return +meanValue.toFixed(
      selectedProperty.precision || defaultDecimalPrecision,
    );
  }

  return +sumValue.toFixed(
    selectedProperty.precision || defaultDecimalPrecision,
  );
};
