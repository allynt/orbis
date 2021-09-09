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

/** @type {import("typings").LayerConfiguration<{defaultValue: string}>} */
export default ({
  id,
  orbState,
  authToken,
  defaultValue,
  activeSources,
  dispatch,
}) => {
  const extruded = extrudedModeSelector(orbState);
  const extrusionScale = extrusionScaleSelector(orbState);
  const source = find(activeSources, { source_id: id });
  const otherState = otherSelector(id)(orbState);
  const { url } = source.metadata;

  const getValue = objects =>
    objects.reduce(
      (sum, obj) =>
        sum + obj[`${otherState?.radioGroupValue ?? defaultValue}_no2`],
      0,
    );

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
    getPosition: d => [d.Longitude, d.Latitude],
    getColorValue: getValue,
    getElevationValue: getValue,
    onDataLoad: () =>
      dispatch(
        setOther({ key: id, other: { ...otherState, isLoading: false } }),
      ),
    updateTriggers: {
      getColorValue: [otherState?.radioGroupValue],
      getElevationValue: [otherState?.radioGroupValue],
      elevationScale: [extruded],
    },
    transitions: {
      getElevationValue: { duration: 1000, easing: easeInOutCubic },
      getColorValue: { duration: 1000, easing: easeInOutCubic },
    },
  };
};
