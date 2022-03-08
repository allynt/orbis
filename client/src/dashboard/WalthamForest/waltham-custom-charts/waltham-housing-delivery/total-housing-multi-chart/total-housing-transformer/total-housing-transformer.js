import { userTargetTransformer } from 'dashboard/WalthamForest/utils.js';

/**
 * @param {object[]} apiData
 * @param {object} targets
 * @param {string[]} filteredTimeline
 * @returns {{
 *  transformedData: { x: string, y: number }[][]
 *  transformedTargets: { x: string, y: number }[]
 * }}
 */
export const totalHousingTransformer = (
  apiData,
  targets = {},
  filteredTimeline,
) => {
  if (!apiData) return;

  const noTargets = !Object.keys(targets).length;
  const transformedTargets = noTargets
    ? null
    : userTargetTransformer(targets, filteredTimeline);

  const transformedData = Object.values(
    filteredTimeline.reduce(
      (acc, year) => {
        const obj = apiData.find(datum => datum.Year === year) ?? {};
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
