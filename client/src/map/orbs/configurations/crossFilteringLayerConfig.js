import { get } from 'lodash';

import { getValueForTimestamp } from 'utils/data';

import { dataSelector } from '../crossfilter-layers.slice';

/** @typedef {import('typings').GeoJsonFeature<import('typings').IsoPlusCommonProperties>} AccessorFeature */

export const COLOR_PRIMARY = [246, 190, 0, 255],
  COLOR_TRANSPARENT = [0, 0, 0, 0],
  COLOR_HOVER = [255, 255, 255],
  OPACITY_FLAT = 150,
  OPACITY_EXTRUDED = OPACITY_FLAT,
  OPACITY_EXTRUDED_SELECTED = 255,
  OPACITY_TRANSPARENT = 0,
  LINE_WIDTH = 0,
  LINE_WIDTH_SELECTED = 3,
  TRANSITION_DURATION = 150,
  // This is used to convert property values from floats to ints
  // to avoid rounding problems. Ints are needed as filtering occurs
  // on the GPU
  FILTER_SCALING_VALUE = 1000;

const GEOMETRY_IDS = {
  LAD_2016: 'LAD Code',
  LAD_2019: 'LAD Code',
  LAD_2020: 'LAD Code',
  LSOA: 'LSOA/DataZone Code',
  MSOA: 'MSOA Code',
  OA: 'OA Code',
};

/**
 * @param {import('typings').GeoJsonFeature} feature
 * @param {import('typings').Property} selectedProperty
 * @param {number} [selectedTimestamp]
 */
export const getValue = (feature, selectedProperty, selectedTimestamp) =>
  selectedProperty.timeseries
    ? getValueForTimestamp(
        feature.properties[selectedProperty.name],
        selectedTimestamp ?? selectedProperty.timeseries_latest_timestamp,
      )
    : get(feature.properties, selectedProperty.name);

/**
 * @param {{
 *   id: string
 *   data: GeoJSON.FeatureCollection
 *   activeSources?: import('typings').Source[]
 *   dispatch: import('redux').Dispatch
 *   orbState: import('../orbReducer').OrbState
 *   authToken?: string
 * crossFilteringCommonGeometry?: object
 * }} parameters
 */
const configuration = ({
  id,
  activeSources,
  dispatch,
  orbState,
  authToken,
  crossFilteringCommonGeometry,
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const urls = dataSelector(orbState);
  const data = urls ? urls[0] : [];
  const extraData = urls ? urls.slice(1) : [];

  return {
    data,
    extraData,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    uniqueIdProperty: GEOMETRY_IDS[crossFilteringCommonGeometry],
    getFillColor: [0, 128, 200, 150],
    getLineColor: [16, 16, 16],
    getLineWidth: 64,
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
  };
};

export default configuration;
