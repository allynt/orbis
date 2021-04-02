import reducer, {
  setState,
  setProperty,
  addClickedFeatures,
  removeClickedFeatures,
  propertySelector,
  clickedFeaturesSelector,
} from './isolation-plus.slice';

describe('isolationPlusSlice', () => {
  describe('reducer', () => {
    describe('setState', () => {
      it('sets the state', () => {
        const state = { property: {} };
        const expected = expect.objectContaining({
          property: { min: 1, max: 2 },
          clickedFeatures: {},
        });
        const payload = {
          property: { min: 1, max: 2 },
          clickedFeatures: {},
        };

        const result = reducer(state, setState(payload));
        expect(result).toEqual(expected);
      });

      it('sets the state without clickedFeatures', () => {
        const state = { property: {} };
        const expected = expect.objectContaining({
          property: {},
          clickedFeatures: undefined,
        });
        const payload = {
          property: {},
        };

        const result = reducer(state, setState(payload));
        expect(result).toEqual(expected);
      });
    });

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
    });

    describe('addClickedFeatures', () => {
      it("Sets clickedFeatures in state if it's undefined", () => {
        const payload = [
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 1,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 2,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
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
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 4,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 5,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
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
              layer: {
                props: {
                  uniqueIdProperty: 'index',
                },
              },
              object: {
                properties: {
                  index: 1,
                },
              },
            },
            {
              layer: {
                props: {
                  uniqueIdProperty: 'index',
                },
              },
              object: {
                properties: {
                  index: 2,
                },
              },
            },
            {
              layer: {
                props: {
                  uniqueIdProperty: 'index',
                },
              },
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
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
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
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 2,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
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
              layer: {
                props: {
                  uniqueIdProperty: 'index',
                },
              },
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
            clickedFeatures: [
              {
                layer: {
                  props: {
                    uniqueIdProperty: 'index',
                  },
                },
                object: { properties: { index: 1 } },
              },
            ],
          }),
        );
      });

      it('Sets clickedFeatures to undefined if all features are removed', () => {
        const feature = [
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: { properties: { index: 1 } },
          },
        ];
        const result = reducer(
          { clickedFeatures: feature },
          removeClickedFeatures(feature),
        );
        expect(result).toEqual(
          expect.objectContaining({ clickedFeatures: undefined }),
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

    describe('clickedFeaturesSelector', () => {
      it('returns undefined if isolationPlus state is undefined', () => {
        const state = {};
        const result = clickedFeaturesSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns clickedFeatures from state', () => {
        const clickedFeatures = [
          { name: 'test feature 1' },
          { name: 'test feature 2' },
          { name: 'test feature 3' },
        ];

        const state = { isolationPlus: { clickedFeatures } };

        const result = clickedFeaturesSelector(state);
        expect(result).toEqual(clickedFeatures);
      });
    });
  });
});
