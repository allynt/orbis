import reducer, {
  categoryFiltersSelector,
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
        expect(result.categoryFilters).toEqual(payload);
      });
    });

    describe('selectors', () => {
      describe('featuresSelector', () => {
        it('returns selected features', () => {
          const state = {
            orbs: {
              mySupplyLynk: {
                categoryFilters: CATEGORIES,
              },
            },
          };
          const result = categoryFiltersSelector(state);
          expect(result).toEqual(state.orbs.mySupplyLynk.categoryFilters);
        });
      });
    });
  });
});
