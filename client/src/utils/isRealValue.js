/**
 * Tests if a value is a usable data value like 0 or ""
 * and not a JS falsy value
 *
 * @param {any} v - the value to test
 * @returns {boolean}
 */
export const isRealValue = v => {
  if (v === undefined || v === null) return false;
  if (typeof v === 'number' && isNaN(v)) return false;
  return true;
};
