/**
 * Calculates a percentage based on a provided min and max
 * range and a data value.
 *
 * @param {number} min
 * @param {number} max
 * @param {number} value
 * @returns {number}
 */
export const getPercentage = (min, max, value) => {
  const result = ((+value - min) / (max - min)) * 100;
  return +result.toFixed(1);
};
