import { CSVLoader } from '@loaders.gl/csv';
import { schemeYlOrRd } from 'd3-scale-chromatic';
import { find } from 'lodash';

import { hexToRgbArray } from 'utils/color';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  extrudedModeSelector,
  extrusionScaleSelector,
  otherSelector,
  setOther,
} from '../layers.slice';

const colorRange = schemeYlOrRd[9].map(hexToRgbArray);

/** @type {import("typings").LayerConfiguration<{defaultValue: string, columnSuffix?: string, valueKey?: string}>} */
export default ({
  id,
  orbState,
  authToken,
  valueKey = 'value',
  defaultValue,
  columnSuffix = '',
  activeSources,
  dispatch,
}) => {
  const extruded = extrudedModeSelector(orbState);
  const extrusionScale = extrusionScaleSelector(orbState);
  const source = find(activeSources, { source_id: id });
  const otherState = otherSelector(id)(orbState);
  const { url } = source.metadata;

  let value = otherState?.[valueKey];
  if (valueKey === 'date' && value) {
    value = new Date(value).toISOString();
  }
  const objectValueKey = `${(value ?? defaultValue).replace(
    '.000Z',
    '',
  )}${columnSuffix}`;
  const getValue = objects =>
    objects.reduce((sum, obj) => sum + obj[objectValueKey], 0);

  return {
    id,
    data: url,
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
    elevationScale: extruded ? extrusionScale : 0,
    extruded: true,
    pickable: true,
    radius: 5000,
    getPosition: d => [d.longitude, d.latitude],
    getColorValue: getValue,
    getElevationValue: getValue,
    onDataLoad: () =>
      dispatch(
        setOther({ key: id, other: { ...otherState, isLoading: false } }),
      ),
    updateTriggers: {
      getColorValue: [otherState?.[valueKey]],
      getElevationValue: [otherState?.[valueKey]],
      elevationScale: [extruded],
    },
    transitions: {
      getElevationValue: { duration: 1000, easing: easeInOutCubic },
      getColorValue: { duration: 1000, easing: easeInOutCubic },
    },
  };
};
