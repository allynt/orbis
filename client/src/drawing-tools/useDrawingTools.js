import { useState } from 'react';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import * as EditModes from '@nebula.gl/edit-modes';
import { featureCollection } from '@turf/helpers';
import { useSelector } from 'react-redux';

import { drawingToolsFeaturesSelector } from './drawing-tools.slice';

export const useDrawingTools = () => {
  const [drawingToolsEnabled, setDrawingToolsEnabled] = useState(false);
  const [drawMode, setDrawMode] = useState(EditModes.ViewMode.name);
  const features = useSelector(drawingToolsFeaturesSelector);

  const editableLayer = new EditableGeoJsonLayer({
    id: 'drawing-tools-editable-layer',
    data: featureCollection(features),
  });

  return {
    editableLayer,
    drawMode,
    setDrawMode,
    drawingToolsEnabled,
    setDrawingToolsEnabled,
  };
};
