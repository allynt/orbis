import { userTargetTransformer } from 'dashboard/WalthamForest/utils';
import { housingTenureTypes } from 'dashboard/WalthamForest/waltham.constants';

/**
 * @param {object[]} apiData
 * @param {object} targets
 * @returns {{
 *  transformedData: object[]
 *  transformedTargets: { x: number, y: number }[]
 * }}
 */
export const tenureHousingTransformer = (
  apiData,
  targets = {},
  filteredTimeline,
) => {
  if (!apiData) return;

  const hasTargets = !!Object.keys(targets).length;

  const transformedTargets = hasTargets
    ? userTargetTransformer(targets, filteredTimeline)
    : null;

  const transformedData = filteredTimeline.map(year => {
    const obj = apiData.find(datum => datum.startYear === year);
    return (
      obj ?? {
        startYear: year,
        ...Object.values(housingTenureTypes).reduce(
          (acc, cur) => ({ ...acc, [cur]: null }),
          {},
        ),
      }
    );
  });

  return { transformedData, transformedTargets };
};
