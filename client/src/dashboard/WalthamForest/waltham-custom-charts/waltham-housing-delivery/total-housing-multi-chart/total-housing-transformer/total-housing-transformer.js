/**
 * This function is necessary because the data does not match what Victory
 * expects. Specifically, the 'gross' and 'net' values must be split into
 * separate arrays so that they can be uses to render separate chart datasets.
 *
 * It is also used to create a stable timeline of earliest-latest year,
 * that can house the data on the chart, allowing missing values from
 * either dataset, padding them with `null` values.
 *
 * @param {object[]} data
 * @param {object} targets
 * @returns {{
 *  transformedData: { x: string, y: number}[][]
 *  transformedTargets: { x: string, y: number }[]|null
 * }}
 */
export const totalHousingTransformer = (data, targets = {}) => {
  if (!data) return;

  // targets may not exist (undefined) or cleared (empty object)
  const noTargets = !Object.keys(targets).length;

  const apiYears = data.map(obj => {
    const [year] = obj.Year.split('-');
    return +year;
  });

  // if targets is undefined, defaulted to object and will return empty array
  const targetYears = noTargets
    ? []
    : Object.keys(targets).map(key => {
        const [year] = key.split('-');
        return +year;
      });

  const allYears = [...apiYears, ...targetYears];

  const min = Math.min(...allYears); // show years back as far as both datasets
  const max = Math.max(...apiYears); // only show years as high as the API data

  let timeline = [];
  for (let i = min; i <= max; i++) {
    timeline = [...timeline, `${i}-${i + 1}`];
  }

  const transformedTargets = noTargets
    ? null
    : Object.entries(targets).reduce(
        (acc, [key, value]) =>
          !timeline.includes(key) ? acc : [...acc, { x: key, y: +value }],
        [],
      );

  const transformedData = Object.values(
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

  return { transformedData, transformedTargets };
};
