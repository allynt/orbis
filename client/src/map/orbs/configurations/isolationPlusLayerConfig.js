import { DataFilterExtension } from '@deck.gl/extensions';
import { get } from 'lodash';

import { logError } from 'data-layers/data-layers.slice';
import { getColorScaleForProperty } from 'utils/color';
import { createReduxSafePickedInfo, getValueForTimestamp } from 'utils/data';
import { isRealValue } from 'utils/isRealValue';

import {
  addClickedFeatures,
  clickedFeaturesSelector,
  hoveredFeaturesSelector,
  extrudedModeSelector,
  extrusionScaleSelector,
  filterValueSelector,
  otherSelector,
  removeClickedFeatures,
  setClickedFeatures,
  setHoveredFeatures,
  timestampSelector,
  dataSelector,
  SHARED_STATE_KEY,
} from '../layers.slice';

/** @typedef {import('typings').GeoJsonFeature<import('typings').IsoPlusCommonProperties>} AccessorFeature */

export const COLOR_PRIMARY = [246, 190, 0, 255],
  COLOR_TRANSPARENT = [0, 0, 0, 0],
  COLOR_HOVER = [255, 255, 255],
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
 * }} parameters
 */
const configuration = ({
  id,
  activeSources,
  dispatch,
  orbState,
  authToken,
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const other = otherSelector(SHARED_STATE_KEY)(orbState);
  const data = dataSelector(id)(orbState);
  const selectedProperty = get(other, 'property');
  if (selectedProperty?.source_id !== id) return undefined;

  const propertyStateKey = `${selectedProperty?.source_id}/${selectedProperty?.name}`;
  const selectedTimestamp = timestampSelector(propertyStateKey)(orbState);

  const filterRange = filterValueSelector(propertyStateKey)(orbState);
  const propertyOther = otherSelector(propertyStateKey)(orbState);
  const clipRange = get(propertyOther, 'clipRange');
  const extrudedMode = extrudedModeSelector(orbState);
  const extrusionScale = extrusionScaleSelector(orbState);
  const clickedFeatures = clickedFeaturesSelector(id)(orbState);
  const hoveredFeatures = hoveredFeaturesSelector(id)(orbState);
  const selectedPropertyMetadata = source?.metadata?.properties?.find(
    property => property.name === selectedProperty.name,
  );
  const colorScale =
    selectedPropertyMetadata &&
    getColorScaleForProperty(
      clipRange
        ? {
            ...selectedPropertyMetadata,
            clip_min: clipRange[0],
            clip_max: clipRange[1],
          }
        : selectedPropertyMetadata,
      'array',
    );

  const clickedFeatureIds = clickedFeatures?.map(f =>
    get(f.object.properties, source?.metadata?.index),
  );
  const anySelected = !!clickedFeatureIds?.length;

  /**
   * @param {AccessorFeature} d
   */
  const isSelected = d =>
    !!clickedFeatureIds?.includes(get(d.properties, source?.metadata?.index));

  /**
   * @param {AccessorFeature} d
   * @returns {number}
   */
  const getElevation = d => {
    if (extrudedMode && (!anySelected || (anySelected && isSelected(d))))
      return getValue(d, selectedProperty, selectedTimestamp);
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
    if (!isRealValue(d.properties[selectedProperty.name])) {
      return COLOR_TRANSPARENT;
    }

    const opacity = getFillOpacity(d);

    if (
      hoveredFeatures?.some(
        feat =>
          feat.object.properties[source?.metadata?.index] ===
          (d.properties[source?.metadata?.index] ?? d.id),
      )
    ) {
      return [...COLOR_HOVER, opacity];
    }

    const color = /** @type {[number,number,number]} */ (
      colorScale &&
        colorScale.get(getValue(d, selectedProperty, selectedTimestamp))
    );

    return [...color, opacity];
  };

  /**
   * @param {import('typings').PolygonPickedMapFeature} info
   * @param {{srcEvent: PointerEvent}} event
   */
  const onClick = (info, event) => {
    /* recreating info as a pure JSON object */
    /* rather than an object w/ nested classes */
    const payload = {
      key: id,
      uniquePropertyPath: `object.properties.${info.layer.props.uniqueIdProperty}`,
      clickedFeatures: [createReduxSafePickedInfo(info)],
    };
    const hasModifier = event.srcEvent.ctrlKey || event.srcEvent.metaKey;
    if (
      !clickedFeatures?.find(
        f =>
          f.object.properties[source.metadata.index] ===
          info.object.properties[source.metadata.index],
      )
    ) {
      if (hasModifier) {
        return dispatch(addClickedFeatures(payload));
      }
      return dispatch(setClickedFeatures(payload));
    }

    if (event.srcEvent.ctrlKey || event.srcEvent.metaKey) {
      return dispatch(removeClickedFeatures(payload));
    }

    return dispatch(setClickedFeatures(payload));
  };

  const onHover = info => {
    if (
      (info.object == null && !!hoveredFeatures?.[0]) ||
      info.object?.properties[source.metadata.index] !==
        hoveredFeatures?.[0]?.object.properties[source.metadata.index]
    )
      return dispatch(
        setHoveredFeatures({
          key: id,
          hoveredFeatures: info.object
            ? [createReduxSafePickedInfo(info)]
            : undefined,
        }),
      );
  };

  /**
   * @param {AccessorFeature} d
   */
  const getFilterValue = d =>
    getValue(d, selectedProperty, selectedTimestamp) * FILTER_SCALING_VALUE;

  const transitions = {
      getFillColor: TRANSITION_DURATION,
      getLineWidth: TRANSITION_DURATION,
    },
    updateTriggers = {
      getFillColor: [
        selectedProperty,
        clickedFeatures,
        selectedTimestamp,
        hoveredFeatures,
        clipRange,
      ],
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
            getFilterValue: [selectedProperty, selectedTimestamp],
            getElevation: [
              extrudedMode,
              clickedFeatures,
              selectedProperty,
              selectedTimestamp,
            ],
          },
        };

  return {
    id,
    data: data[0],
    authToken,
    visible: !!source && selectedProperty.source_id === id,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    uniqueIdProperty: source?.metadata?.index,
    pickable: true,
    autoHighlight: false,
    onClick,
    onHover,
    getLineColor: COLOR_PRIMARY,
    getLineWidth,
    lineWidthUnits: 'pixels',
    getFillColor,
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
    ...typedProps,
    dataTransform: (data, previousData) =>
      data.map(feature => ({
        ...feature,
        properties: Object.entries(feature.properties).reduce(
          (prev, [key, value]) => {
            let result = null;
            try {
              result = JSON.parse(value);
            } catch (error) {}
            return {
              ...prev,
              [key]: result ?? value,
            };
          },
        ),
      })),
    onError: () => dispatch(logError({ source_id: id })),
  };
};

export default configuration;
