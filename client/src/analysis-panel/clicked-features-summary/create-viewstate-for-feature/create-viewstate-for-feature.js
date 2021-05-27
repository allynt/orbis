import { bbox } from '@turf/turf';
import { fitBounds } from '@math.gl/web-mercator';

export const createViewstateForFeature = ({
  feature,
  viewport,
  padding = 50,
}) => {
  if (!feature || !viewport) return;

  const { width, height } = viewport,
    points = bbox(feature?.object?.geometry);

  const [minX, minY, maxX, maxY] = points;

  const bounds = [
    [minX, minY],
    [maxX, maxY],
  ];

  const { longitude, latitude, zoom } = fitBounds({
    bounds,
    width,
    height,
    padding,
  });

  return {
    longitude,
    latitude,
    zoom,
  };
};
