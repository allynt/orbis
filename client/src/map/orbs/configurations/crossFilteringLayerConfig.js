import { DataFilterExtension } from '@deck.gl/extensions';
import { get } from 'lodash';

import { getColorScaleForProperty } from 'utils/color';
import { isRealValue } from 'utils/isRealValue';

import {
  crossFilterValuesSelector,
  selectedPropertySelector,
  activeCrossFilteringLayersSelector,
  setIsViewportLoaded,
} from '../crossfilter-layers.slice';

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
export const getValue = (feature, selectedProperty) =>
  get(feature.properties, selectedProperty.name);

/**
 * @param {{
 *   id: string
 *   data: GeoJSON.FeatureCollection
 *   activeSources?: import('typings').Source[]
 *   dispatch: import('redux').Dispatch
 *   orbState: import('../orbReducer').OrbState
 *   authToken?: string
 * crossFilteringCommonGeometry?: object
 * crossFilteringSelectedProperties?: object
 * }} parameters
 */
const configuration = ({
  id,
  activeSources,
  orbState,
  authToken,
  crossFilteringCommonGeometry,
  crossFilteringSelectedProperties,
  dispatch,
}) => {
  const filterableProperties = Object.values(
    crossFilteringSelectedProperties,
  ).reduce((acc, val) => {
    return [...acc, ...val];
  }, []);

  const source = activeSources?.find(source => source.source_id === id);

  const urls = activeCrossFilteringLayersSelector(orbState);
  const data = urls ? urls[0] : [];
  const extraData = urls ? urls.slice(1) : [];

  const filterRanges = crossFilterValuesSelector(orbState);
  const filterRangeValues = Object.values(filterRanges);

  const getFilterValue = feature =>
    filterableProperties.map(property => feature.properties[property.name]);

  const selectedProperty = selectedPropertySelector(orbState);

  const colorScale =
    selectedProperty && getColorScaleForProperty(selectedProperty, 'array');

  const getFillOpacity = feature => {
    const value = feature.properties[selectedProperty?.name];

    // Zero is a valid value, so we need to ensure we don't accidentally
    // set it to transparent, in that situation.
    if (!value && value !== 0) {
      return OPACITY_TRANSPARENT;
    }

    return OPACITY_EXTRUDED;
  };

  const getFillColor = feature => {
    if (!isRealValue(feature.properties[selectedProperty?.name])) {
      return COLOR_TRANSPARENT;
    }

    const opacity = getFillOpacity(feature);

    const colorValue = feature.properties[selectedProperty?.name];
    let color = colorScale ? colorScale.get(colorValue) : COLOR_TRANSPARENT;

    return [...color, opacity];
  };

  return {
    id: source?.name,
    data,
    extraData,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    uniqueIdProperty: GEOMETRY_IDS[crossFilteringCommonGeometry],
    getFillColor,
    getLineColor: COLOR_PRIMARY,
    getLineWidth: LINE_WIDTH,
    extensions: [
      new DataFilterExtension({
        filterSize: filterableProperties.length,
      }),
    ],
    getFilterValue,
    filterRange: filterRangeValues,
    updateTriggers: {
      getFillColor,
      getFilterValue,
    },
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
    onViewportLoad: () => dispatch(setIsViewportLoaded(true)),
  };
};

export default configuration;
