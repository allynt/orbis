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
export const groupedDataTransformer = data => {
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
export const lineDataTransformer = data => {
  if (!data) return;

  const uniqueKeys = [
    ...new Set(data.reduce((acc, cur) => [...acc, ...Object.keys(cur)], [])),
  ];

  return data.map(obj =>
    uniqueKeys.reduce((acc, cur) => ({ ...acc, [cur]: obj[cur] ?? null }), {}),
  );
};

/**
 * Utilities to look at data and work out the width hints for bars.
 * For charts where groups (if any) are on the z axis use BaseWidthCalculator
 * For grouped charts, where groups appear side-by-side on x axis, use GroupedWidthCalculator
 * @param {*} data
 */
export const BaseWidthCalculator = (data, width) => {
  return {
    width: width,
    barWidth: 100.0 / data.length,
    offset: 0,
  };
};

export const GroupedWidthCalculator = (data, width) => {
  // magic numbers, tweak to change feel
  const barGapMultiplier = 1.44; // gap between bars, where 1 = bar width
  const minBarWidth = 3; // can be no narrower than this

  const groupCount = data.length;
  const thinness = groupCount * 2; // increase to narrow the bars
  const dataPointCount = Object.keys(data[0]).length;
  const zoneWidth = width / dataPointCount;
  const barWidth = minBarWidth + zoneWidth / (groupCount * thinness);
  const offset = barWidth * barGapMultiplier;
  return {
    width,
    barWidth,
    offset,
  };
};
