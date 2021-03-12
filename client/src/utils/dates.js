import { addDays, subDays } from 'date-fns';
import format from 'date-fns/format';

/** @param {Date} date */
export const formatDate = (date, formatString = 'dd/MM/yyyy') =>
  format(date, formatString);

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

export const DATE_SEPARATOR = '\\/|-|\\.';

/**
 * @param {string} dateString
 * @returns {[d: number, m: number, y: number]}
 */
export const toDMY = dateString =>
  // @ts-ignore
  dateString.split(new RegExp(DATE_SEPARATOR)).map(Number);

/** @param {string} dateString */
export const dateStringToDate = dateString => {
  const [d, m, y] = toDMY(dateString);
  return new Date(y, m - 1, d);
};

/** @param {Partial<import('typings/orbis').DateRange<string>>} range */
export const stringDateRangeToDateRange = (range, daysDifference = 30) => {
  /** @type {import('typings/orbis').DateRange<Date>} */
  let dateRep = {};
  const { startDate, endDate } = range;
  if (!startDate && !endDate) return undefined;
  if (startDate) {
    dateRep.startDate = dateStringToDate(startDate);
  }
  if (endDate) {
    dateRep.endDate = dateStringToDate(endDate);
  }
  if (!startDate && endDate) {
    dateRep.startDate = subDays(dateRep.endDate, daysDifference);
  }
  if (!endDate && startDate) {
    dateRep.endDate = addDays(dateRep.startDate, daysDifference);
  }
  return dateRep;
};
