import { GeoJsonLayer } from 'deck.gl';
import { interpolateGreens } from 'd3-scale-chromatic';

const average = array =>
  array.reduce((sum, element) => sum + element.value, 0) / array.length;

const rgbStringToArray = string => {
  const values = string.match(/(\d)+/g);
  return values.map(str => +str);
};

export const paddiesHealthLayer = (id, data, visible) =>
  new GeoJsonLayer({
    id,
    data,
    visible,
    stroked: false,
    filled: true,
    extruded: true,
    getFillColor: paddy => [
      ...rgbStringToArray(interpolateGreens(average(paddy.properties.ndvi))),
      200,
    ],
    getElevation: paddy => average(paddy.properties.lai_cab),
  });
