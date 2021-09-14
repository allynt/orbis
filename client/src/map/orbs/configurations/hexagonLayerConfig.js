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
  visibilitySelector,
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
  const visible = visibilitySelector(id)(orbState);
  const otherState = otherSelector(id)(orbState);
  const { url } = source.metadata;

  let value = otherState?.[valueKey];
  if (valueKey === 'date' && value) {
    value = new Date(value).toISOString();
  }
  const columnName = `${value ?? defaultValue}${columnSuffix}`;
  const getValue = objects =>
    objects.reduce((sum, obj) => sum + obj[columnName], 0);

  return {
    id,
    data: url,
    visible: visible && source,
    loaders: [CSVLoader],
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
      csv: {
        header: true,
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
