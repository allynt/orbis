import { fitBounds } from '@math.gl/web-mercator';
import { bbox } from '@turf/turf';

import { limitDecimals } from 'data-layers/aoi/aoi-utils';

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
    longitude: limitDecimals(longitude),
    latitude: limitDecimals(latitude),
    zoom: limitDecimals(zoom),
  };
};
