import { bbox } from '@turf/turf';
import { fitBounds } from '@math.gl/web-mercator';
import { FlyToInterpolator } from '@deck.gl/core';
import { easeInOutCubic } from 'utils/easingFunctions';

export const createViewstateForFeature = ({ feature, viewState, viewport }) => {
  if (!feature || !viewState || !viewport) return;

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
    ...viewState,
    longitude,
    latitude,
    zoom,
    transitionDuration: 2000,
    transitionEasing: easeInOutCubic,
    transitionInterpolator: new FlyToInterpolator(),
  };
};
