import { loadInBatches } from '@loaders.gl/core';
import { CSVLoader } from '@loaders.gl/csv';
import { schemeYlOrRd } from 'd3-scale-chromatic';
import { find } from 'lodash';

import { hexToRgbArray } from 'utils/color';

import { dataSelector, otherSelector } from '../layers.slice';

const colorRange = schemeYlOrRd[9].map(hexToRgbArray);

/** @type {import("typings").LayerConfiguration<{defaultValue: string}>} */
export default ({
  id,
  orbState,
  authToken,
  defaultValue = 'summer',
  activeSources,
}) => {
  const source = find(activeSources, { source_id: id });
  const otherState = otherSelector(id)(orbState);
  const { url } = source.metadata;

  async function* getData() {
    const iterator = await loadInBatches(url, CSVLoader, {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
      csv: {
        worker: true,
      },
    });
    for await (const batch of iterator) {
      switch (batch.batchType) {
        case 'metadata':
          break;
        default:
          yield batch.data;
      }
    }
  }

  const getWeight = d =>
    d[`${otherState?.radioGroupValue ?? defaultValue}_no2`];

  return {
    id,
    data: getData(),
    // loaders: [CSVLoader],
    // loadOptions: {
    //   fetch: {
    //     headers: {
    //       Authorization: `Bearer ${authToken}`,
    //     },
    //   },
    // },
    colorRange,
    coverage: 1,
    // elevationRange: [0, 3000],
    elevationScale: 500,
    extruded: true,
    pickable: true,
    radius: 5000,
    getPosition: d => [d.Longitude, d.Latitude],
    getColorWeight: getWeight,
    getElevationWeight: getWeight,
    updateTriggers: {
      getColorWeight: [otherState?.radioGroupValue],
      getElevationWeight: [otherState?.radioGroupValue],
    },
  };
};
