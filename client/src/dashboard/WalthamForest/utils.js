import { LAST_5_YEARS } from './waltham.constants';

/**
 * This function iterates over the combined API and target data and builds
 * a consistent timeline from the earliest to latest years that appears in
 * both arrays
 *
 * @param {object[]} apiData
 * @param {object[]} targetData
 * @returns {string[]}
 */
const getTimeline = (apiData, targetData) => {
  const apiYears = apiData.map(obj => {
    const [year] = obj.Year.split('-');
    return +year;
  });

  const targetYears = !!targetData
    ? Object.keys(targetData).map(key => {
        const [year] = key.split('-');
        return +year;
      })
    : [];

  const allYears = [...apiYears, ...targetYears];

  const min = Math.min(...allYears);
  const max = Math.max(...allYears);

  let timeline = [];
  for (let i = min; i <= max; i++) {
    timeline = [...timeline, `${i}-${i + 1}`];
  }

  return timeline;
};

/**
 * This function is necessary because the data does not match what Victory
 * expects. Specifically, the 'gross' and 'net' values must be split into
 * separate arrays so that they can be uses to render separate chart data.
 *
 * @param {object[]} data
 * @param {object[]} targets
 * @returns {{
 *  x: string
 *  y: number
 * }[][]}
 */
const groupedDataTransformer = (data, targets) => {
  if (!data) return;

  const timeline = getTimeline(data, targets);

  return Object.values(
    timeline.reduce(
      (acc, year) => {
        const obj = data.find(datum => datum.Year === year) ?? {};
        return {
          gross: [
            ...acc.gross,
            { x: `${year}`, y: obj['Total Gross'] ?? null },
          ],
          net: [...acc.net, { x: `${year}`, y: obj['Total Net'] ?? null }],
        };
      },
      { gross: [], net: [] },
    ),
  );
};

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
 * This function transforms a key/value object into X/Y data to be rendered
 * on a line chart, and converts any 'y' values from strings to numbers, as
 * Victory can only render number values, and will break with strings.
 * @param {object} data
 */
const userTargetTransformer = data => {
  if (!data) return;

  return Object.entries(data).reduce(
    (acc, [key, value]) => [...acc, { x: key, y: +value }],
    [],
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
  getTimeline,
  groupedDataTransformer,
  lineDataTransformer,
  userTargetTransformer,
  filterEmptyStrings,
  getTargetTotals,
  getUser5YearTotals,
};
