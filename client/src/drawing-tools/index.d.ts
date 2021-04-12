import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Feature } from '@turf/helpers';

export type DrawingToolsState = {
  features?: Feature[];
};

export type SetFeaturesAction = CaseReducer<
  DrawingToolsState,
  PayloadAction<Feature[]>
>;

export type DrawingToolsActions = { setFeatures: SetFeaturesAction };
