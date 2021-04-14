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