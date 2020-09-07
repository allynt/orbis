import reducer, {
  featuresSelector,
  setSelectedFeatures,
} from './mysupplylynk.slice';

import { CATEGORIES } from './mysupplylynk.constants';

describe('MySupplyLynk slice', () => {
  describe('reducer', () => {
    describe('setSelectedFeatures', () => {
      it('sets the selected features in state', () => {
        const state = { selectedFeatures: CATEGORIES };
        const payload = ['PPE, Miscellaneous'];
        const result = reducer(state, setSelectedFeatures(payload));
        expect(result.selectedFeatures).toEqual(payload);
      });
    });

    describe('selectors', () => {
      describe('featuresSelector', () => {
        it('returns selected features', () => {
          const state = {
            orbs: {
              mySupplyLynk: {
                selectedFeatures: CATEGORIES,
              },
            },
          };
          const result = featuresSelector(state);
          expect(result).toEqual(state.orbs.mySupplyLynk.selectedFeatures);
        });
      });
    });
  });
});
