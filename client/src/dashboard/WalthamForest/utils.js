/**
 * This function is necessary because the data does not match what Victory
 * expects. Specifically, the 'gross' and 'net' values must be split into
 * separate arrays so that they can be uses to render separate chart data.
 *
 * @param {object[]} data
 * @returns {{
 *  x: string
 *  y: number
 * }[][]}
 */
const groupedDataTransformer = data => {
  if (!data) return;

  return Object.values(
    data.reduce(
      (acc, cur) => ({
        gross: [...acc.gross, { x: cur.Year, y: cur['Total Gross'] }],
        net: [...acc.net, { x: cur.Year, y: cur['Total Net'] }],
      }),
      { gross: [], net: [] },
    ),
  );
};

/**
 * This function is necessary because the data entries do not always have equal
 * keys, and victory does not accept missing keys. It does however accept 'null'
 * values, so this fills any missing keys will 'null' so the data is useable.
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

const getTargetTotals = data => {
  if (!data) return;

  return Object.values(data).reduce(
    (acc, targets) => ({
      ...acc,
      ...Object.entries(targets)
        .map(([year, target]) => {
          let number = +target;
          return { [year]: (number += acc[year] ?? 0) };
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    }),
    {},
  );
};

export {
  groupedDataTransformer,
  lineDataTransformer,
  userTargetTransformer,
  filterEmptyStrings,
  getTargetTotals,
};
