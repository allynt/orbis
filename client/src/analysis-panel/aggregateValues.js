import { sumBy } from 'lodash';

/**
 *
 * @param {any[]} clickedFeatures
 * @param {Partial<import('typings/orbis').Property>} selectedProperty
 */
export const aggregateValues = (clickedFeatures, selectedProperty) => {
  const sumValue = sumBy(
    clickedFeatures,
    `object.properties.${selectedProperty?.name}`,
  );
  if (selectedProperty.aggregation === 'mean') {
    const meanValue = sumValue / clickedFeatures?.length;
    if (selectedProperty.precision)
      return Number(meanValue.toFixed(selectedProperty.precision));
    return meanValue;
  }
  return sumValue;
};
