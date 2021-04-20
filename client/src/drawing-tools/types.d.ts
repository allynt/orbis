import { EditableGeoJsonLayer } from '@nebula.gl/layers';
// import { DRAW_MODE_MAP } from './drawing-tools.config';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Feature, FeatureCollection } from '@turf/helpers';
import { EditMode } from './drawing-tools.config';

export type EditMode = EditMode;

export type DrawingToolsProps = {
  editableLayer: EditableGeoJsonLayer;
  drawMode: EditMode;
  setDrawMode: React.Dispatch<EditMode>;
  drawingToolsEnabled: boolean;
  setDrawingToolsEnabled: React.Dispatch<boolean>;
};

export type DrawingToolsState = {
  features?: Feature[];
};

export type SetFeaturesAction = CaseReducer<
  DrawingToolsState,
  PayloadAction<Feature[] | FeatureCollection>
>;

type RemoveFeaturesByIndexAction = CaseReducer<
  DrawingToolsState,
  PayloadAction<number[]>
>;

export type DrawingToolsActions = {
  removeFeaturesByIndex: RemoveFeaturesByIndexAction;
  setFeatures: SetFeaturesAction;
};
