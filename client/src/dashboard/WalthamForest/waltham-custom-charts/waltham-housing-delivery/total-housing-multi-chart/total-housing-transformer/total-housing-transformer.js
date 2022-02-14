import {
  getDataTimeline,
  userTargetTransformer,
} from 'dashboard/WalthamForest/utils.js';

/**
 * @param {object[]} apiData
 * @param {object} targets
 * @returns {{
 *  transformedData: { x: string, y: number }[][]
 *  transformedTargets: { x: string, y: number }[]
 * }}
 */
export const totalHousingTransformer = (apiData, targets = {}) => {
  if (!apiData) return;

  const noTargets = !Object.keys(targets).length;
  const timeline = getDataTimeline(apiData, targets);

  const transformedTargets = noTargets
    ? null
    : userTargetTransformer(targets, timeline);

  const transformedData = Object.values(
    timeline.reduce(
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
