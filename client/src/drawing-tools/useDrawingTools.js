import { useState } from 'react';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import * as EditModes from '@nebula.gl/edit-modes';
import { useSelector } from 'react-redux';

import { drawingToolsFeatureCollectionSelector } from './drawing-tools.slice';

export const useDrawingTools = () => {
  const [drawingToolsEnabled, setDrawingToolsEnabled] = useState(false);
  const [drawMode, setDrawMode] = useState(EditModes.ViewMode.name);
  const featureCollection = useSelector(drawingToolsFeatureCollectionSelector);

  const editableLayer = new EditableGeoJsonLayer({
    id: 'drawing-tools-editable-layer',
    data: featureCollection,
  });

  return {
    editableLayer,
    drawMode,
    setDrawMode,
    drawingToolsEnabled,
    setDrawingToolsEnabled,
  };
};
