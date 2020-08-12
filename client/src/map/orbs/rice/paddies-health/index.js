import { GeoJsonLayer } from 'deck.gl';
import chroma from 'chroma-js';

const averageValueForTimeRange = (array, min, max) => {
  const filtered = array.filter(value => {
    const date = new Date(value.timestamp);
    return min <= date && date <= max;
  });
  return (
    filtered.reduce((prev, curr) => prev + curr.value, 0) / filtered.length
  );
};

export const paddiesHealthLayer = ({ id, data, visible, dateRange }) => {
  const colorScale = chroma.scale('Greens');

  return new GeoJsonLayer({
    id,
    data,
    visible,
    stroked: false,
    filled: true,
    extruded: true,
    getFillColor: paddy => [
      ...colorScale(
        averageValueForTimeRange(
          paddy.properties.ndvi,
          dateRange?.min,
          dateRange?.max,
        ),
      ).rgb(),
      200,
    ],
    getElevation: paddy =>
      averageValueForTimeRange(
        paddy.properties.lai_cab,
        dateRange.min,
        dateRange.max,
      ),
    updateTriggers: {
      getFillColor: [dateRange],
      getElevation: [dateRange],
    },
  });
};
