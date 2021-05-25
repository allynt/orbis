import { bbox } from '@turf/turf';
import { fitBounds } from '@math.gl/web-mercator';

export const createViewstateForFeature = ({ feature, viewport }) => {
  if (!feature || !viewport) return;

  const { width, height } = viewport,
    points = bbox(feature?.object?.geometry);

  const minX = points[0],
    maxX = points[2],
    minY = points[1],
    maxY = points[3];

  const bounds = [
    [minX, minY],
    [maxX, maxY],
  ];

  const { longitude, latitude, zoom } = fitBounds({
    bounds,
    width,
    height,
    padding: 50,
  });

  return {
    longitude,
    latitude,
    zoom,
  };
};
