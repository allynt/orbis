import { useEffect, useState } from 'react';

import { darken, rgbToHex } from '@astrosat/astrosat-ui';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import {
  ViewMode,
  DrawPointMode,
  DrawPolygonMode,
  MeasureDistanceMode,
  TransformMode,
  ModifyMode,
} from '@nebula.gl/edit-modes';
import { findIndex } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import {
  drawingToolsFeatureCollectionSelector,
  removeFeaturesByIndex,
  setFeatures,
} from './drawing-tools.slice';
import { hexToRgbArray } from 'utils/color';
import { selectedMapStyleIdSelector } from 'map/map.slice';

const KEY_CODES = { DELETE: 'Delete', BACKSPACE: 'Backspace' };

/** @type {Map<import('./types').EditMode, any>} */
const DRAW_MODE_MAP = new Map([
  ['ViewMode', ViewMode],
  ['DrawPointMode', DrawPointMode],
  ['DrawPolygonMode', DrawPolygonMode],
  ['MeasureDistanceMode', MeasureDistanceMode],
  ['TransformMode', TransformMode],
  ['ModifyMode', ModifyMode],
]);

/** @type {import('./types').EditMode[]} */
const SELECTABLE_MODES = ['TransformMode', 'ModifyMode'];

const FEATURE_COLORS = [
  '#00AEE4',
  '#DAF0E3',
  '#9BCC32',
  '#07A35A',
  '#F7DF90',
  '#EA376C',
  '#6A126A',
  '#FCB09B',
  '#B0592D',
  '#C1B5E3',
  '#9C805B',
  '#CCDFE5',
];

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

  /** @param {KeyboardEvent} event */
  const handleKeyPress = event => {
    switch (event.key) {
      case KEY_CODES.BACKSPACE:
      case KEY_CODES.DELETE:
        handleDeleteKey();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyPress);
    return () => document.removeEventListener('keyup', handleKeyPress);
  });

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
    mode: DRAW_MODE_MAP.get(drawMode),
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
