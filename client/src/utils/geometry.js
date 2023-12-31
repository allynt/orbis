import { polygon, area } from '@turf/turf';

/**
 * @param {number[][]} geometry
 */
export const getGeometryAreaKmSquared = geometry => {
  const feat = polygon([geometry]);
  return area(feat) / 1000000;
};
