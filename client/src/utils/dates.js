import format from 'date-fns/format';

export const FORMAT = 'yyyy-MM-dd';

export default date => (date ? format(date, 'MMMM do yyyy') : 'N/A');

/**
 * @param {number} d
 * @param {number} m
 * @param {number} y
 */
export const isValid = (d, m, y) => {
  let _d = d,
    _m = m - 1,
    _y = y;
  if (`${y}`.length === 2) {
    const yearPrefix = new Date().getFullYear().toString().slice(0, 2);
    _y = Number(`${yearPrefix}${y}`);
  }
  const date = new Date(_y, _m, _d);
  return (
    date.getFullYear() === _y && date.getMonth() === _m && date.getDate() === _d
  );
};
