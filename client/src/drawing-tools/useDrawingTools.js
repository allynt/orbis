import { useState } from 'react';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import * as EditModes from '@nebula.gl/edit-modes';
import { findIndex } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import {
  drawingToolsFeatureCollectionSelector,
  setFeatures,
} from './drawing-tools.slice';
import { hexToRgbArray } from 'utils/color';

const FEATURE_COLORS = [
  '00AEE4',
  'DAF0E3',
  '9BCC32',
  '07A35A',
  'F7DF90',
  'EA376C',
  '6A126A',
  'FCB09B',
  'B0592D',
  'C1B5E3',
  '9C805B',
  'CCDFE5',
].map(hexToRgbArray);

/**
 * @param {import('@turf/helpers').Feature} feature
 * @param {import('@turf/helpers').Feature[]} features
 * @param {number} alpha
 */
const getColor = (feature, features, alpha) => {
  const index = findIndex(features, feature);
  return [...FEATURE_COLORS[index % FEATURE_COLORS.length], alpha * 255];
};

export const useDrawingTools = () => {
  const [drawingToolsEnabled, setDrawingToolsEnabled] = useState(false);
  const [drawMode, setDrawMode] = useState(EditModes.ViewMode.name);
  const featureCollection = useSelector(drawingToolsFeatureCollectionSelector);
  const dispatch = useDispatch();

  /**
   * @param {import('@turf/helpers').Feature} feature
   */
  const getFillColor = feature =>
    getColor(feature, featureCollection.features, 0.5);

  /**
   * @param {import('@turf/helpers').Feature} feature
   */
  const getLineColor = feature =>
    getColor(feature, featureCollection.features, 1);

  /**
   * @param {{
   *   editType: string
   *   updatedData: import('@turf/helpers').FeatureCollection
   * }} params
   */
  const onEdit = ({ editType, updatedData }) => {
    if (editType === 'addFeature') dispatch(setFeatures(updatedData));
  };

  const editableLayer = new EditableGeoJsonLayer({
    id: 'drawing-tools-editable-layer',
    data: featureCollection,
    mode: EditModes[drawMode],
    selectedFeatureIndexes: [],
    pointRadiusMinPixels: 5,
    getFillColor,
    getLineColor,
    onEdit,
  });

  return {
    editableLayer,
    drawMode,
    setDrawMode,
    drawingToolsEnabled,
    setDrawingToolsEnabled,
  };
};
