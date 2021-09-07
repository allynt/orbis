import { CSVLoader } from '@loaders.gl/csv';
import { schemeYlOrRd } from 'd3-scale-chromatic';

import { hexToRgbArray } from 'utils/color';

import { dataSelector } from '../layers.slice';

const colorRange = schemeYlOrRd[9].map(hexToRgbArray);

/** @type {import("typings").LayerConfiguration} */
export default ({ id, orbState, authToken }) => {
  const data = dataSelector(id)(orbState);

  return {
    id,
    data,
    loaders: [CSVLoader],
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
    colorRange,
    coverage: 1,
    // elevationRange: [0, 3000],
    // elevationScale: data && data.length ? 50 : 0,
    // extruded: true,
    pickable: true,
    radius: 5000,
    getPosition: d => [d.Longitude, d.Latitude],
    getColorWeight: d => d.summer_no2,
    transitions: {
      elevationScale: 3000,
    },
  };
};
