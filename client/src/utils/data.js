import { find } from 'lodash';

/**
 * @template V
 * @param {{timestamp: string, value: V}[]} timeseries
 * @param {string|number} timestamp
 * @returns {V}
 */
export const getValueForTimestamp = (timeseries, timestamp) => {
  const searchTimestamp =
    typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  return find(timeseries, ({ timestamp }) => {
    const date = new Date(timestamp).getTime();
    return date === searchTimestamp;
  })?.value;
};

/**
 * @param {import('typings').PickedMapFeature} info
 */
export const createReduxSafePickedInfo = info => ({
  index: info?.index,
  object: info?.object,
  layer: {
    id: info?.layer.id,
    props: {
      uniqueIdProperty: info?.layer?.props?.uniqueIdProperty,
    },
  },
});

/**
 * @param {import('typings').Source} source
 */
export const dataUrlFromSource = source => {
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};
