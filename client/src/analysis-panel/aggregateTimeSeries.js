import { findIndex, flatten, get } from 'lodash';

import { DEFAULT_DECIMAL_PRECISION } from 'map/map.constants';

/**
 * @param {import("typings/orbis").PolygonPickedMapFeature[]} clickedFeatures
 * @param {import("typings/orbis").ContinuousProperty} selectedProperty
 * @returns {{timestamp: string, value: any}[]}
 */
export const aggregateTimeSeries = (clickedFeatures, selectedProperty) => {
  const allValues = clickedFeatures.map(f =>
    get(f.object.properties, selectedProperty.name),
  );
  const flat = flatten(allValues);
  const summed = flat.reduce((combined, timestampAndValue) => {
    const { timestamp, value } = timestampAndValue;
    const existingIndex = findIndex(combined, ['timestamp', timestamp]);
    if (existingIndex >= 0) {
      const existing = combined[existingIndex];
      const removed = combined.filter(({ timestamp: t }) => t !== timestamp);
      return [...removed, { timestamp, value: existing.value + value }];
    }
    return [...combined, { timestamp, value }];
  }, []);
  if (selectedProperty.aggregation === 'mean')
    return summed.map(({ timestamp, value }) => ({
      timestamp,
      value: Number(
        (value / clickedFeatures.length).toFixed(
          selectedProperty.precision ?? DEFAULT_DECIMAL_PRECISION,
        ),
      ),
    }));
  return summed;
};
