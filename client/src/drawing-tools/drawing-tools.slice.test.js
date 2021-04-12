import { featureCollection } from '@turf/helpers';
import reducer, {
  setFeatures,
  drawingToolsFeatureCollectionSelector,
} from './drawing-tools.slice';

describe('drawing tools slice', () => {
  describe('actions', () => {
    describe('setFeatures', () => {
      const features = [{ id: 1 }, { id: 2 }];
      it('Creates a new feature collection and sets features', () => {
        expect(reducer({}, setFeatures(features))).toEqual(
          expect.objectContaining({
            features,
          }),
        );
      });

      it('Sets features if featureCollection exists', () => {
        const result = reducer(
          { features: [{ id: 3 }, { id: 4 }] },
          setFeatures(features),
        );
        expect(result.features).toEqual(features);
      });

      it('Sets features if payload is a FeatureCollection', () => {
        const result = reducer({}, setFeatures(featureCollection(features)));
        expect(result.features).toEqual(features);
      });
    });
  });

  describe('selectors', () => {
    describe('drawingToolsFeaturesSelector', () => {
      it('returns an empty feature collection if drawingTools is undefined', () => {
        expect(drawingToolsFeatureCollectionSelector({})).toEqual(
          featureCollection([]),
        );
      });

      it('returns a feature collection with the features from state', () => {
        const state = {
          drawingTools: {
            features: [{ id: 1 }, { id: 2 }],
          },
        };
        expect(drawingToolsFeatureCollectionSelector(state)).toEqual(
          featureCollection(state.drawingTools.features),
        );
      });
    });
  });
});
