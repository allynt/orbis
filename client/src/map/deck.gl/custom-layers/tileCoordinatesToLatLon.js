import { lerp } from 'math.gl';

const availableTransformations = {
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
};

const Point = ([pointX, pointY], [nw, se], viewport) => {
  const x = lerp(nw[0], se[0], pointX);
  const y = lerp(nw[1], se[1], pointY);

  return viewport.unprojectFlat([x, y]);
};

const getPoints = (geometry, bbox, viewport) => {
  return geometry.map(g => Point(g, bbox, viewport));
};

const MultiPoint = (multiPoint, bbox, viewport) => {
  return getPoints(multiPoint, bbox, viewport);
};

const LineString = (line, bbox, viewport) => {
  return getPoints(line, bbox, viewport);
};

const MultiLineString = (multiLineString, bbox, viewport) => {
  return multiLineString.map(lineString =>
    LineString(lineString, bbox, viewport),
  );
};

const Polygon = (polygon, bbox, viewport) => {
  return polygon.map(polygonRing => getPoints(polygonRing, bbox, viewport));
};

const MultiPolygon = (multiPolygon, bbox, viewport) => {
  return multiPolygon.map(polygon => Polygon(polygon, bbox, viewport));
};

export const tileCoordinatesToLatLon = (object, bbox, viewport) => {
  const nw = viewport.projectFlat([bbox.west, bbox.north]),
    se = viewport.projectFlat([bbox.east, bbox.south]),
    projectedBbox = [nw, se],
    type = object?.geometry?.type,
    coords = object?.geometry?.coordinates;

  const result = {
    ...object,
    geometry: {
      type,
      coordinates: availableTransformations[type]?.(
        coords,
        projectedBbox,
        viewport,
      ),
    },
  };

  return result;
};
