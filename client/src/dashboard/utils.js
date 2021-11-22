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
