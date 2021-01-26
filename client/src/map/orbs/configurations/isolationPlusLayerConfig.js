import { DataFilterExtension } from '@deck.gl/extensions';
import { ColorScale } from 'utils/color';
import { extrudedModeSelector, extrusionScaleSelector } from '../orbReducer';

import {
  filterRangeSelector,
  propertySelector,
  setClickedFeatures,
  clickedFeaturesSelector,
  addClickedFeatures,
  removeClickedFeatures,
} from '../slices/isolation-plus.slice';

/** @typedef {import('typings/orbis').GeoJsonFeature<import('typings/orbis').IsoPlusCommonProperties>} AccessorFeature */

const COLOR_PRIMARY = [246, 190, 0, 255],
  COLOR_TRANSPARENT = [0, 0, 0, 0],
  OPACITY_FLAT = 150,
  OPACITY_EXTRUDED = OPACITY_FLAT,
  OPACITY_EXTRUDED_SELECTED = 255,
  LINE_WIDTH = 0,
  LINE_WIDTH_SELECTED = 3,
  TRANSITION_DURATION = 150;

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  orbState,
  authToken,
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const selectedProperty = propertySelector(orbState);
  const filterRange = filterRangeSelector(orbState);
  const extrudedMode = extrudedModeSelector(orbState);
  const extrusionScale = extrusionScaleSelector(orbState);
  const clickedFeatures = clickedFeaturesSelector(orbState);
  const selectedPropertyMetadata = source?.metadata?.properties?.find(
    property => property.name === selectedProperty.name,
  );
  const colorScale =
    selectedPropertyMetadata &&
    new ColorScale({
      color: selectedPropertyMetadata?.application?.orbis?.display?.color,
      domain: [selectedProperty?.min, selectedProperty?.max],
      reversed:
        selectedPropertyMetadata?.application?.orbis?.display
          ?.colormap_reversed,
      clip: (selectedPropertyMetadata?.clip_min ||
        selectedPropertyMetadata?.clip_max) && [
        selectedPropertyMetadata.clip_min || selectedPropertyMetadata.min,
        selectedPropertyMetadata.clip_max || selectedPropertyMetadata.max,
      ],
      format: 'array',
    });

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
    if (!anySelected || (anySelected && isSelected(d)))
      return d.properties[selectedProperty.name];
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
    if (!extrudedMode) return OPACITY_FLAT;
    if (!anySelected || (anySelected && isSelected(d)))
      return OPACITY_EXTRUDED_SELECTED;
    return OPACITY_EXTRUDED;
  };

  /**
   * @param {AccessorFeature} d
   * @returns {[r:number, g:number, b:number, a?: number]}
   */
  const getFillColor = d => {
    if (!d.properties[selectedProperty.name]) return COLOR_TRANSPARENT;
    const color = /** @type {[number,number,number]} */ (colorScale &&
      colorScale.get(d.properties[selectedProperty.name]));
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

  return {
    id,
    data,
    authToken,
    visible: !!source && selectedProperty.source_id === id,
    minZoom: source.metadata.minZoom,
    maxZoom: source.metadata.maxZoom,
    uniqueIdProperty: source.metadata.uniqueIdProperty,
    pickable: true,
    autoHighlight: true,
    onClick,
    extruded: extrudedMode,
    getElevation: getElevation,
    elevationScale: extrusionScale,
    getLineColor: COLOR_PRIMARY,
    getLineWidth: getLineWidth,
    lineWidthUnits: 'pixels',
    getFillColor: getFillColor,
    getFilterValue: d => Math.round(d.properties[selectedProperty.name]),
    filterRange: filterRange || [
      selectedPropertyMetadata?.min,
      selectedPropertyMetadata?.max,
    ],
    transitions: {
      getFillColor: TRANSITION_DURATION,
      getLineWidth: TRANSITION_DURATION,
      getElevation: TRANSITION_DURATION,
    },
    updateTriggers: {
      getFillColor: [extrudedMode, selectedProperty, clickedFeatures],
      getFilterValue: [selectedProperty],
      getLineWidth: [clickedFeatures],
      getElevation: [extrudedMode, clickedFeatures, selectedProperty],
    },
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
};

export default configuration;
