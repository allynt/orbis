import reducer, {
  setFeatures,
  drawingToolsFeaturesSelector,
} from './drawing-tools.slice';

describe('drawing tools slice', () => {
  describe('actions', () => {
    describe('setFeatures', () => {
      it('Sets features in state', () => {
        const features = [{ id: 1 }, { id: 2 }];
        expect(reducer({}, setFeatures(features))).toEqual({
          features,
        });
      });
    });
  });

  describe('selectors', () => {
    describe('drawingToolsFeaturesSelector', () => {
      it('returns undefined if drawingTools is undefined', () => {
        expect(drawingToolsFeaturesSelector({})).toBeUndefined();
      });

      it('selects features from state', () => {
        const state = { drawingTools: { features: [{ id: 1 }, { id: 2 }] } };
        expect(drawingToolsFeaturesSelector(state)).toEqual(
          state.drawingTools.features,
        );
      });
    });
  });
});
