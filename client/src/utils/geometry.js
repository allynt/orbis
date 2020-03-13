/**
 * Get the bounding box for a piece of geometry defined by [lon, lat] points.
 *
 * @param {[number, number][]} geometry The geometry to get the bounding box for. Should be an array of [lon, lat]
 * @returns {[number, number][]} The bounding box defined by its southwest and northeast points
 * fit to the provided geometry
 */
export const getBoundsOfGeometry = geometry => {
  if (!geometry) throw new TypeError('Must provide geometry');
  if (!Array.isArray(geometry)) throw new TypeError('geometry must be an array');
  if (geometry.length <= 0) throw new RangeError('Geometry must have at least one point');

  const lons = geometry.map(point => point[0]);
  const lats = geometry.map(point => point[1]);
  const sw = [Math.min(...lons), Math.min(...lats)];
  const ne = [Math.max(...lons), Math.max(...lats)];
  return [sw, ne];
};

/**
 * Get the center point of a piece of geometry defined by [lon, lat] points
 *
 * @param {[number, number][]} geometry The geometry to get the center point for. Should be array of [lon, lat]
 * @returns {[number, number]} The LonLat array defining the center point of the geometry
 */
export const getCenterOfGeometry = geometry => {
  if (!geometry) throw new TypeError('Must provide geometry');
  if (!Array.isArray(geometry)) throw new TypeError('geometry must be an array');
  if (geometry.length <= 0) throw new RangeError('geometry must have at least one point');

  const { length } = geometry;
  const centerLon = geometry.reduce((acc, cur) => acc + cur[0], 0) / length;
  const centerLat = geometry.reduce((acc, cur) => acc + cur[1], 0) / length;
  return [centerLon, centerLat];
};
