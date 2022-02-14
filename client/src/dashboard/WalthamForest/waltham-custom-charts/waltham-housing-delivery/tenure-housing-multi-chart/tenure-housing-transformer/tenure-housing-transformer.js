import {
  getDataTimeline,
  userTargetTransformer,
} from 'dashboard/WalthamForest/utils';
import { housingTenureTypes } from 'dashboard/WalthamForest/waltham.constants';

/**
 * @param {object[]} apiData
 * @param {object} targets
 * @returns {{
 *  transformedData: object[]
 *  transformedTargets: { x: string, y: number }[]
 * }}
 */
export const tenureHousingTransformer = (apiData, targets = {}) => {
  if (!apiData) return;

  const noTargets = !Object.keys(targets).length;
  const timeline = getDataTimeline(apiData, targets);

  const transformedTargets = noTargets
    ? null
    : userTargetTransformer(targets, timeline);

  const transformedData = timeline.map(year => {
    const obj = apiData.find(datum => datum.Year === year);
    return (
      obj ?? {
        Year: year,
        ...Object.values(housingTenureTypes).reduce(
          (acc, cur) => ({ ...acc, [cur]: null }),
          {},
        ),
      }
    );
  });

  return { transformedData, transformedTargets };
};
