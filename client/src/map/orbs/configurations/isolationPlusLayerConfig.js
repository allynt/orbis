import { DataFilterExtension } from '@deck.gl/extensions';
import { find } from 'lodash';
import { getColorScaleForProperty } from 'utils/color';
import { isRealValue } from 'utils/isRealValue';
import { extrudedModeSelector, extrusionScaleSelector } from '../orbReducer';
import {
  addClickedFeatures,
  clickedFeaturesSelector,
  filterRangeSelector,
  propertySelector,
  removeClickedFeatures,
  setClickedFeatures,
} from '../slices/isolation-plus.slice';

/** @typedef {import('typings/orbis').GeoJsonFeature<import('typings/orbis').IsoPlusCommonProperties>} AccessorFeature */

export const COLOR_PRIMARY = [246, 190, 0, 255],
  COLOR_TRANSPARENT = [0, 0, 0, 0],
  OPACITY_FLAT = 150,
  OPACITY_EXTRUDED = OPACITY_FLAT,
  OPACITY_EXTRUDED_SELECTED = 255,
  LINE_WIDTH = 0,
  LINE_WIDTH_SELECTED = 3,
  TRANSITION_DURATION = 150,
  // This is used to convert property values from floats to ints
  // to avoid rounding problems. Ints are needed as filtering occurs
  // on the GPU
  FILTER_SCALING_VALUE = 1000;

/**
 * @param {import('typings/orbis').GeoJsonFeature} feature
 * @param {import('typings/orbis').Property} selectedProperty
 */
const getValue = (feature, selectedProperty) =>
  selectedProperty.timeseries
    ? find(feature.properties[selectedProperty.name], [
        'timestamp',
        selectedProperty.timeseries_latest_timestamp,
      ]).value
    : feature.properties[selectedProperty.name];

/**
 * @param {{
 *   id: string
 *   data: GeoJSON.FeatureCollection
 *   activeSources?: import('typings/orbis').Source[]
 *   dispatch: import('redux').Dispatch
 *   orbState: import('../orbReducer').OrbState
 *   authToken?: string
 * }} parameters
 */
const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  orbState,
  authToken,
}) => {
  const selectedProperty = propertySelector(orbState);
  if (selectedProperty.source_id !== id) return undefined;

  const source = activeSources?.find(source => source.source_id === id);
  const filterRange = filterRangeSelector(orbState);
  const extrudedMode = extrudedModeSelector(orbState);
  const extrusionScale = extrusionScaleSelector(orbState);
  const clickedFeatures = clickedFeaturesSelector(orbState);
  const selectedPropertyMetadata = source?.metadata?.properties?.find(
    property => property.name === selectedProperty.name,
  );
  const colorScale =
    selectedPropertyMetadata &&
    getColorScaleForProperty(selectedPropertyMetadata, 'array');

  const clickedFeatureIds = clickedFeatures?.map(
    f => f.object.properties.index,
  );
  const anySelected = !!clickedFeatureIds?.length;

  /**
   * @param {AccessorFeature} d
   */
  const isSelected = d => !!clickedFeatureIds?.includes(d.properties.index);

  /**
   * @param {AccessorFeature} d
   * @returns {number}
   */
  const getElevation = d => {
    if (extrudedMode && (!anySelected || (anySelected && isSelected(d))))
      return getValue(d, selectedProperty);
    return 0;
  };

  /**
   * @param {AccessorFeature} d
   * @returns {number}
   */
  const getLineWidth = d => (isSelected(d) ? LINE_WIDTH_SELECTED : LINE_WIDTH);

  /**
   * @param {AccessorFeature} d
   * @returns {number}
   */
  const getFillOpacity = d => {
    if (!extrudedMode || selectedProperty.type === 'discrete')
      return OPACITY_FLAT;
    if (!anySelected || (anySelected && isSelected(d)))
      return OPACITY_EXTRUDED_SELECTED;
    return OPACITY_EXTRUDED;
  };

  /**
   * @param {AccessorFeature} d
   * @returns {[r:number, g:number, b:number, a?: number]}
   */
  const getFillColor = d => {
    if (!isRealValue(d.properties[selectedProperty.name]))
      return COLOR_TRANSPARENT;
    const color = /** @type {[number,number,number]} */ (colorScale &&
      colorScale.get(getValue(d, selectedProperty)));
    return [...color, getFillOpacity(d)];
  };

  /**
   * @param {import('typings/orbis').PolygonPickedMapFeature} info
   * @param {{srcEvent: PointerEvent}} event
   */
  const onClick = (info, event) => {
    const hasModifier = event.srcEvent.ctrlKey || event.srcEvent.metaKey;
    if (
      !clickedFeatures?.find(
        f => f.object.properties.index === info.object.properties.index,
      )
    ) {
      if (hasModifier) {
        return dispatch(addClickedFeatures([info]));
      }
      return dispatch(setClickedFeatures([info]));
    }

    if (event.srcEvent.ctrlKey || event.srcEvent.metaKey) {
      return dispatch(removeClickedFeatures([info]));
    }

    return dispatch(setClickedFeatures([info]));
  };

  /**
   * @param {AccessorFeature} d
   */
  const getFilterValue = d =>
    getValue(d, selectedProperty) * FILTER_SCALING_VALUE;

  const transitions = {
      getFillColor: TRANSITION_DURATION,
      getLineWidth: TRANSITION_DURATION,
    },
    updateTriggers = {
      getFillColor: [selectedProperty, clickedFeatures],
      getLineWidth: [clickedFeatures],
    };

  const typedProps =
    selectedProperty.type === 'discrete'
      ? {
          transitions,
          updateTriggers,
        }
      : {
          extruded: extrudedMode,
          getElevation,
          elevationScale: extrusionScale,
          extensions: [new DataFilterExtension({ filterSize: 1 })],
          getFilterValue,
          filterRange: (
            filterRange || [
              selectedPropertyMetadata?.min,
              selectedPropertyMetadata?.max,
            ]
          ).map(f => f * FILTER_SCALING_VALUE),
          transitions: {
            ...transitions,
            getElevation: TRANSITION_DURATION,
          },
          updateTriggers: {
            ...updateTriggers,
            getFillColor: [...updateTriggers.getFillColor, extrudedMode],
            getFilterValue: [selectedProperty],
            getElevation: [extrudedMode, clickedFeatures, selectedProperty],
          },
        };

  return {
    id,
    data,
    authToken,
    binary: true,
    visible: !!source && selectedProperty.source_id === id,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    uniqueIdProperty: source?.metadata?.uniqueIdProperty,
    pickable: true,
    autoHighlight: true,
    onClick,
    getLineColor: COLOR_PRIMARY,
    getLineWidth,
    lineWidthUnits: 'pixels',
    getFillColor,
    ...typedProps,
  };
};

export default configuration;
