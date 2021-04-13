import { useEffect, useState } from 'react';

import { darken, rgbToHex } from '@astrosat/astrosat-ui';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import * as EditModes from '@nebula.gl/edit-modes';
import { findIndex } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import {
  drawingToolsFeatureCollectionSelector,
  removeFeaturesByIndex,
  setFeatures,
} from './drawing-tools.slice';
import { hexToRgbArray } from 'utils/color';

const KEY_CODES = { DELETE: 'Delete' };

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
 * @param {number[]} [defaultSelectedFeatureIndexes]
 */
export const useDrawingTools = (defaultSelectedFeatureIndexes = []) => {
  const [drawingToolsEnabled, setDrawingToolsEnabled] = useState(false);
  /** @type {[keyof EditModes, React.Dispatch<keyof EditModes>]} */
  const [drawMode, setDrawMode] = useState(
    /** @type {keyof EditModes} */ (EditModes.ViewMode.name),
  );
  const featureCollection = useSelector(drawingToolsFeatureCollectionSelector);
  const dispatch = useDispatch();
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState(
    defaultSelectedFeatureIndexes,
  );

  const handleDeleteKey = () => {
    dispatch(removeFeaturesByIndex(selectedFeatureIndexes));
    setSelectedFeatureIndexes([]);
  };

  /** @param {KeyboardEvent} event */
  const handleKeyPress = event => {
    switch (event.key) {
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
   *   editType: string
   *   updatedData: import('@turf/helpers').FeatureCollection
   * }} params
   */
  const onEdit = ({ editType, updatedData }) => {
    if (editType === 'addFeature') dispatch(setFeatures(updatedData));
  };

  /** @param {{index: number}} params */
  const onClick = ({ index }) => {
    setSelectedFeatureIndexes([index]);
  };

  const editableLayer = new EditableGeoJsonLayer({
    id: 'drawing-tools-editable-layer',
    data: featureCollection,
    mode: EditModes[drawMode],
    selectedFeatureIndexes,
    pointRadiusMinPixels: 5,
    getFillColor,
    getLineColor,
    onEdit,
    onClick,
  });

  return {
    editableLayer,
    drawMode,
    setDrawMode,
    drawingToolsEnabled,
    setDrawingToolsEnabled,
  };
};
