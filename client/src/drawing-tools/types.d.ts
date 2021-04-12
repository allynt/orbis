import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Feature, FeatureCollection } from '@turf/helpers';

export type DrawingToolsState = {
  features?: Feature[];
};

export type SetFeaturesAction = CaseReducer<
  DrawingToolsState,
  PayloadAction<Feature[] | FeatureCollection>
>;

export type DrawingToolsActions = { setFeatures: SetFeaturesAction };
