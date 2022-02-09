import { LAST_5_YEARS } from './waltham.constants';

/**
 * This function is necessary because the data entries do not always have equal
 * keys, and victory does not accept missing keys. It does however accept 'null'
 * values, so this fills any missing keys with 'null' so the data is useable.
 *
 * @param {Object[]} data
 * @returns {Object[]}
 */
const lineDataTransformer = data => {
  if (!data) return;

  const uniqueKeys = [
    ...new Set(data.reduce((acc, cur) => [...acc, ...Object.keys(cur)], [])),
  ];

  return data.map(obj =>
    uniqueKeys.reduce((acc, cur) => ({ ...acc, [cur]: obj[cur] ?? null }), {}),
  );
};

/**
 * This is here because typing into a field and then deleting the input
 * results in an empty string being saved, which is then converted into
 * a number on the frontend, which JavaScript type conversion reads as zero.
 * @param {object} data
 */
const filterEmptyStrings = data => {
  if (!data) return;

  return Object.entries(data).reduce(
    (acc, [key, value]) => (value === '' ? acc : { ...acc, [key]: value }),
    {},
  );
};

/**
 * This function transforms a key/value object into X/Y data to be rendered
 * on a line chart, and converts any 'y' values from strings to numbers, as
 * Victory can only render number values, and will break with strings.
 * @param {object} data
 * @returns {{ x: string, y: number }[]}
 */
const userTargetTransformer = data => {
  if (!data) return;

  return Object.entries(data).reduce(
    (acc, [key, value]) => [...acc, { x: key, y: +value }],
    [],
  );
};

/**
 * This is here to reduce the totals for every year across multiple tenure types
 * into a single object consisting of year ranges and total number values.
 * @param {object} data
 */
const getTargetTotals = data => {
  if (!data) return;

  // extract year/value objects, eg: [{ '2016-2017': 123 }, { 2016-2017': 456 }]
  return Object.entries(data).reduce(
    (acc, [key, targets]) =>
      key === 'totalHousing'
        ? acc
        : {
            ...acc,
            // create array of new objects with accumulated totals for values
            ...Object.entries(targets)
              .map(([year, target]) => {
                let num = +target;
                return { [year]: (num += acc[year] ?? 0) };
              })
              // reduce array of totals objects into a single object
              .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
          },
    {},
  );
};

/**
 * This tallies up the user's 'total housing' target data for the last 5 years,
 * to be used in the progress wheels.
 * @param {object} obj
 */
const getUser5YearTotals = obj => {
  if (!obj) return;

  return LAST_5_YEARS.reduce(
    (acc, cur) => (acc += !!obj[cur] ? +obj[cur] : 0),
    0,
  );
};

export {
  lineDataTransformer,
  userTargetTransformer,
  filterEmptyStrings,
  getTargetTotals,
  getUser5YearTotals,
};
