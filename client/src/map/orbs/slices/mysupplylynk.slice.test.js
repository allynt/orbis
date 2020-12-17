import reducer, {
  categoryFiltersSelectorFactory,
  setSelectedFeatures,
} from './mysupplylynk.slice';

import { CATEGORIES } from './mysupplylynk.constants';

describe('MySupplyLynk slice', () => {
  describe('reducer', () => {
    describe('setSelectedFeatures', () => {
      it('sets the selected features in state', () => {
        const state = {
          categoryFilters: {},
        };
        const payload = {
          layer: 'test_layer',
          value: ['PPE, Miscellaneous'],
        };
        const result = reducer(state, setSelectedFeatures(payload));
        expect(result.categoryFilters['test_layer']).toEqual(payload.value);
      });
    });

    describe('selectors', () => {
      describe('featuresSelector', () => {
        it('returns selected features', () => {
          const id = 'layer1';
          const state = {
            mySupplyLynk: {
              categoryFilters: {},
            },
          };
          const results = categoryFiltersSelectorFactory(state)(id);

          expect(results).toEqual(CATEGORIES);
        });
      });
    });
  });
});
