import reducer, {
  categoryFiltersSelector,
  setSelectedFeatures,
} from './mysupplylynk.slice';

import { LAYERS, CATEGORIES } from './mysupplylynk.constants';

describe('MySupplyLynk slice', () => {
  describe('reducer', () => {
    describe('setSelectedFeatures', () => {
      it('sets the selected features in state', () => {
        const state = {
          categoryFilters: {
            [LAYERS.suppliers]: CATEGORIES,
            [LAYERS.nonRegistered]: CATEGORIES,
            [LAYERS.cqc]: CATEGORIES,
          },
        };
        const payload = {
          layer: LAYERS.suppliers,
          value: ['PPE, Miscellaneous'],
        };
        const result = reducer(state, setSelectedFeatures(payload));
        expect(result.categoryFilters[LAYERS.suppliers]).toEqual(payload.value);
      });
    });

    describe('selectors', () => {
      describe('featuresSelector', () => {
        it('returns selected features', () => {
          const state = {
            mySupplyLynk: {
              categoryFilters: {
                layer1: CATEGORIES,
                layer2: CATEGORIES,
                layer3: CATEGORIES,
              },
            },
          };
          const results = categoryFiltersSelector(state);

          expect(results).toEqual(state.mySupplyLynk.categoryFilters);
        });
      });
    });
  });
});
