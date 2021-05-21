import { bbox } from '@turf/turf';
import { fitBounds } from '@math.gl/web-mercator';

export const zoomToBoundingBox = ({
  feature,
  viewState,
  setViewState,
  viewport,
}) => {
  const points = bbox(feature?.object.geometry);

  const minX = points[0],
    maxX = points[2],
    minY = points[1],
    maxY = points[3];

  const bounds = [
    [minX, minY],
    [maxX, maxY],
  ];

  const { width, height } = viewport;

  const { longitude, latitude, zoom } = fitBounds({
    bounds,
    width,
    height,
    padding: 50,
  });

  const newViewstate = {
    ...viewState,
    longitude,
    latitude,
    zoom,
  };

  return setViewState(newViewstate);
};
