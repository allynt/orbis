import reducer, {
  propertySelector,
  setProperty,
  filterRangeSelector,
  setFilterRange,
  addClickedFeatures,
  removeClickedFeatures,
} from './isolation-plus.slice';

describe('isolationPlusSlice', () => {
  describe('reducer', () => {
    describe('setProperty', () => {
      it('sets the property for a source in state if not yet defined', () => {
        const state = { property: {} };
        const expected = expect.objectContaining({
          property: { source_id: 'test/layer', name: 'hello' },
        });
        const payload = { source_id: 'test/layer', name: 'hello' };
        const result = reducer(state, setProperty(payload));
        expect(result).toEqual(expected);
      });

      it('overwrites the property for a source in state if it exists', () => {
        const state = {
          property: { source_id: 'test/layer', name: 'no thanks' },
        };
        const expected = expect.objectContaining({
          property: { source_id: 'test/layer', name: 'hello' },
        });
        const payload = { source_id: 'test/layer', name: 'hello' };
        const result = reducer(state, setProperty(payload));
        expect(result).toEqual(expected);
      });

      it('resets `filterData` when new property is selected', () => {
        const state = {
          property: {
            source_id: 'test/layer',
            name: 'old filter data',
            min: 0,
            max: 100,
          },
        };

        const payload = {
          source_id: 'test/layer',
          name: 'new filter data',
          min: 0,
          max: 200,
        };

        const expected = [0, 200];

        const result = reducer(state, setProperty(payload));
        expect(result.filterRange).toEqual(expected);
      });
    });

    describe('setFilterData', () => {
      it('sets the filter data in state', () => {
        const payload = [1, 2];
        const result = reducer({}, setFilterRange(payload));
        expect(result).toEqual({ filterRange: payload });
      });
    });

    describe('addClickedFeatures', () => {
      it("Sets clickedFeatures in state if it's undefined", () => {
        const payload = [
          {
            object: {
              properties: {
                index: 1,
              },
            },
          },
          {
            object: {
              properties: {
                index: 2,
              },
            },
          },
          {
            object: {
              properties: {
                index: 3,
              },
            },
          },
        ];
        const result = reducer({}, addClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({ clickedFeatures: payload }),
        );
      });

      it('Combines existing clicked features with the new ones', () => {
        const payload = [
          {
            object: {
              properties: {
                index: 4,
              },
            },
          },
          {
            object: {
              properties: {
                index: 5,
              },
            },
          },
          {
            object: {
              properties: {
                index: 6,
              },
            },
          },
        ];
        const state = {
          clickedFeatures: [
            {
              object: {
                properties: {
                  index: 1,
                },
              },
            },
            {
              object: {
                properties: {
                  index: 2,
                },
              },
            },
            {
              object: {
                properties: {
                  index: 3,
                },
              },
            },
          ],
        };
        const result = reducer(state, addClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({
            clickedFeatures: expect.arrayContaining([
              ...state.clickedFeatures,
              ...payload,
            ]),
          }),
        );
      });

      it('Does not duplicate features base on their index property', () => {
        const payload = [
          {
            object: {
              properties: {
                index: 1,
              },
            },
          },
        ];
        const state = {
          clickedFeatures: [{ object: { properties: { index: 1 } } }],
        };
        const result = reducer(state, addClickedFeatures(payload));
        expect(result).toEqual(state);
      });
    });

    describe('removeClickedFeatures', () => {
      it('Removes all clickedFeatures from state', () => {
        const payload = [
          {
            object: {
              properties: {
                index: 2,
              },
            },
          },
          {
            object: {
              properties: {
                index: 3,
              },
            },
          },
        ];
        const state = {
          clickedFeatures: [
            {
              object: {
                properties: {
                  index: 1,
                },
              },
            },
            ...payload,
          ],
        };
        const result = reducer(state, removeClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({
            clickedFeatures: [{ object: { properties: { index: 1 } } }],
          }),
        );
      });
    });
  });

  describe('selectors', () => {
    describe('propertySelector', () => {
      it('returns the property for the specified layer', () => {
        const state = {
          isolationPlus: {
            property: {
              source_id: 'test/layer',
              name: 'hello',
            },
          },
        };
        const result = propertySelector(state);
        expect(result).toEqual(state.isolationPlus.property);
      });

      it('returns undefined if state is undefined', () => {
        const result = propertySelector(undefined);
        expect(result).toBeUndefined();
      });

      it('returns undefined if orbs is undefined', () => {
        const result = propertySelector({});
        expect(result).toBeUndefined();
      });

      it('returns undefined if isolationPlus is undefined', () => {
        const result = propertySelector({ orbs: {} });
        expect(result).toBeUndefined();
      });

      it('returns undefined if the layer is undefined in state', () => {
        const result = propertySelector({ orbs: { isolationPlus: {} } });
        expect(result).toBeUndefined();
      });

      it('returns undefined if source_id is undefined', () => {
        const result = propertySelector({
          orbs: { isolationPlus: { 'test/layer': 'hello' } },
        });
        expect(result).toBeUndefined();
      });
    });

    describe('filterRangeSelector', () => {
      it('returns undefined if isolationPlus state is undefined', () => {
        const state = {};
        const result = filterRangeSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns filterRange from state', () => {
        const filterRange = [1, 2];
        const state = { isolationPlus: { filterRange } };
        const result = filterRangeSelector(state);
        expect(result).toEqual(filterRange);
      });
    });
  });
});
