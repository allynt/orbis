import { darken, rgbToHex } from '@astrosat/astrosat-ui';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { useDocumentEventListener } from 'hooks/useDocumentEventListener';
import { findIndex, get } from 'lodash';
import { selectedMapStyleIdSelector } from 'map/map.slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hexToRgbArray } from 'utils/color';
import { KEY_CODES } from 'utils/KEY_CODES';
import {
  DRAW_MODE_MAP,
  FEATURE_COLORS,
  SELECTABLE_MODES,
} from './drawing-tools.config';
import {
  drawingToolsFeatureCollectionSelector,
  removeFeaturesByIndex,
  setFeatures,
} from './drawing-tools.slice';

/**
 * @param {import('@turf/helpers').Feature} feature
 * @param {import('@turf/helpers').Feature[]} features
 * @param {number} alpha
 * @param {number} [brightness]
 */
const getColor = (feature, features, alpha, brightness = 1.0) => {
  const index = findIndex(features, feature);
  const color = hexToRgbArray(
    rgbToHex(darken(FEATURE_COLORS[index % FEATURE_COLORS.length], brightness)),
  );
  return [...color, alpha * 255];
};

/**
 * @param {{
 *  defaultSelectedFeatureIndexes?: number[]
 *  defaultDrawMode?: import('./types').EditMode
 * defaultDrawingToolsEnabled?: boolean
 * }} params
 * @returns {import('./types').DrawingToolsProps}
 */
export const useDrawingTools = ({
  defaultSelectedFeatureIndexes = [],
  defaultDrawMode = 'ViewMode',
  defaultDrawingToolsEnabled = false,
} = {}) => {
  const mapStyle = useSelector(selectedMapStyleIdSelector);
  const [drawingToolsEnabled, setDrawingToolsEnabled] = useState(
    defaultDrawingToolsEnabled,
  );
  /** @type {[import('./types').EditMode, React.Dispatch<import('./types').EditMode>]} */
  const [drawMode, setDrawMode] = useState(defaultDrawMode);
  const featureCollection = useSelector(drawingToolsFeatureCollectionSelector);
  const dispatch = useDispatch();
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState(
    defaultSelectedFeatureIndexes,
  );

  useEffect(() => {
    if (!drawingToolsEnabled) {
      setSelectedFeatureIndexes([]);
      setDrawMode('ViewMode');
    }
  }, [drawingToolsEnabled]);

  useEffect(() => {
    if (!SELECTABLE_MODES.includes(drawMode)) setSelectedFeatureIndexes([]);
  }, [drawMode]);

  const handleDeleteKey = () => {
    dispatch(removeFeaturesByIndex(selectedFeatureIndexes));
    setSelectedFeatureIndexes([]);
  };

  const handleEscapeKey = () => {
    setSelectedFeatureIndexes([]);
    setDrawMode('ViewMode');
  };

  /** @param {KeyboardEvent} event */
  const handleKeyPress = event => {
    switch (event.key) {
      case KEY_CODES.BACKSPACE:
      case KEY_CODES.DELETE:
        handleDeleteKey();
        break;
      case KEY_CODES.ESCAPE:
        handleEscapeKey();
        break;
      default:
        break;
    }
  };
  useDocumentEventListener('keyup', handleKeyPress);

  /**
   * @param {import('@turf/helpers').Feature} feature
   * @param {boolean} isSelected
   */
  const getFillColor = (feature, isSelected) =>
    getColor(feature, featureCollection.features, 0.5, isSelected ? 0 : 0.3);

  /**
   * @param {import('@turf/helpers').Feature} feature
   * @param {boolean} isSelected
   */
  const getLineColor = (feature, isSelected) =>
    getColor(feature, featureCollection.features, 1, isSelected ? 0 : 0.3);

  /**
   * @param {{
   *   updatedData: import('@turf/helpers').FeatureCollection
   * }} params
   */
  const onEdit = ({ updatedData }) => {
    dispatch(setFeatures(updatedData));
  };

  /** @param {{index: number, isGuide: boolean}} params */
  const onClick = ({ index, isGuide }) => {
    if (!drawingToolsEnabled || !SELECTABLE_MODES.includes(drawMode) || isGuide)
      return;
    setSelectedFeatureIndexes([index]);
  };

  const editableLayer = new EditableGeoJsonLayer({
    id: 'drawing-tools-editable-layer',
    data: featureCollection,
    mode: get(DRAW_MODE_MAP, drawMode),
    selectedFeatureIndexes,
    pointRadiusMinPixels: 5,
    getFillColor,
    getLineColor,
    onEdit,
    onClick,
    modeConfig: {
      turfOptions: {
        units: 'miles',
      },
    },
    _subLayerProps: {
      tooltips: {
        getColor:
          mapStyle === 'dark' || mapStyle === 'satellite'
            ? [255, 255, 255, 255]
            : [0, 0, 0, 255],
      },
    },
  });

  return {
    editableLayer,
    drawMode,
    setDrawMode,
    drawingToolsEnabled,
    setDrawingToolsEnabled,
  };
};
