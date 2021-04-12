import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Feature, FeatureCollection } from '@turf/helpers';

export type DrawingToolsState = {
  featureCollection?: FeatureCollection;
};

export type SetFeaturesAction = CaseReducer<
  DrawingToolsState,
  PayloadAction<Feature[]>
>;

export type DrawingToolsActions = { setFeatures: SetFeaturesAction };
