import reducer, {
  setFeatures,
  drawingToolsFeatureCollectionSelector,
} from './drawing-tools.slice';

describe('drawing tools slice', () => {
  describe('actions', () => {
    describe('setFeatures', () => {
      it('Creates a new feature collection and sets features', () => {
        const features = [{ id: 1 }, { id: 2 }];
        expect(reducer({}, setFeatures(features))).toEqual({
          featureCollection: expect.objectContaining({
            features,
          }),
        });
      });

      it('Sets features if featureCollection exists', () => {
        const features = [{ id: 1 }, { id: 2 }];
        expect(
          reducer(
            { featureCollection: { features: [{ id: 3 }, { id: 4 }] } },
            setFeatures(features),
          ),
        ).toEqual({
          featureCollection: expect.objectContaining({
            features,
          }),
        });
      });
    });
  });

  describe('selectors', () => {
    describe('drawingToolsFeaturesSelector', () => {
      it('returns undefined if drawingTools is undefined', () => {
        expect(drawingToolsFeatureCollectionSelector({})).toBeUndefined();
      });

      it('selects features from state', () => {
        const state = {
          drawingTools: {
            featureCollection: { features: [{ id: 1 }, { id: 2 }] },
          },
        };
        expect(drawingToolsFeatureCollectionSelector(state)).toEqual(
          state.drawingTools.featureCollection,
        );
      });
    });
  });
});
