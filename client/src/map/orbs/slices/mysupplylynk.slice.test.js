import reducer, {
  categoryFiltersSelector,
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
          const state = {
            mySupplyLynk: {
              categoryFilters: {},
            },
          };
          const results = categoryFiltersSelector(state);

          expect(results).toEqual(state.mySupplyLynk.categoryFilters);
        });
      });
    });
  });
});
