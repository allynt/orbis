import { useState } from 'react';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import * as EditModes from '@nebula.gl/edit-modes';
import { useDispatch, useSelector } from 'react-redux';

import {
  drawingToolsFeatureCollectionSelector,
  setFeatures,
} from './drawing-tools.slice';

export const useDrawingTools = () => {
  const [drawingToolsEnabled, setDrawingToolsEnabled] = useState(false);
  const [drawMode, setDrawMode] = useState(EditModes.DrawPointMode.name);
  const featureCollection = useSelector(drawingToolsFeatureCollectionSelector);
  const dispatch = useDispatch();

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
    mode: EditModes.DrawPointMode,
    selectedFeatureIndexes: [],
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
