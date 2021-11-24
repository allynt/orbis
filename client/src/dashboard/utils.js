/**
 * Genericized version.
 * @param {*} data
 * @param {string} groupColumn - name of column used for grouping
 * @param {array[string]} columns - list of columns we want to add (miss out to use all)
 * @returns
 */

export const GroupedDataTransformer = (
  data,
  groupColumn = 'Year',
  columns = null,
) => {
  let transformedData = [];
  let datum = data[0];
  if (!columns) {
    columns = Object.keys(datum);
  }
  for (const column of columns) {
    if (column !== groupColumn) {
      let series = data.map(cur => {
        return {
          x: cur[groupColumn],
          y: cur[column],
        };
      });
      transformedData.push(series);
    }
  }
  return transformedData;
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
