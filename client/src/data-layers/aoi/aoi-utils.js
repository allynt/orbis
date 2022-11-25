import { FlyToInterpolator } from '@deck.gl/core';
import { fitBounds, getFlyToDuration } from '@math.gl/web-mercator';
import { bbox, bboxPolygon, buffer, point } from '@turf/turf';

import { easeInOutCubic } from 'utils/easingFunctions';

export const limitDecimals = (value, limit = 6) =>
  Math.round(value * Math.pow(10, limit)) / Math.pow(10, limit);

export const createViewstateForSuggestion = ({
  suggestion,
  viewport,
  padding = 50,
}) => {
  if (!suggestion || !viewport) return;

  const { width, height } = viewport;
  let feature = null;

  switch (suggestion.type) {
    case 'postcode':
      feature = bboxPolygon(bbox(suggestion.geometry));
      break;

    case 'postcode-area':
    case 'national-grid':
    case 'protected-area':
      feature = bboxPolygon(suggestion.bbox);
      break;

    case 'place':
      feature = bboxPolygon(bbox(buffer(point(suggestion.center), 10)));
      break;

    default:
      break;
  }

  const [minX, minY, maxX, maxY] = feature.bbox;

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

export const zoomToArea = (viewport, viewState, setViewState, suggestion) => {
  const newViewState = createViewstateForSuggestion({
    suggestion,
    viewport,
  });

  const { width, height } = viewport;
  const { longitude, latitude, zoom } = viewState;

  return setViewState({
    ...viewState,
    ...newViewState,
    transitionDuration: getFlyToDuration(
      {
        // @ts-ignore
        width,
        height,
        longitude,
        latitude,
        zoom,
      },
      newViewState,
    ),
    transitionEasing: easeInOutCubic,
    transitionInterpolator: new FlyToInterpolator(),
  });
};
