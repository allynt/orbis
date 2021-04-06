// @ts-nocheck

import reducer, {
  clickedFeaturesSelector,
  extrudedModeSelector,
  extrusionScaleSelector,
  filterValueSelector,
  hoveredFeaturesSelector,
  visibilitySelector,
  otherSelector,
  setClickedFeatures,
  addClickedFeatures,
  removeClickedFeatures,
  setExtrusionScale,
  setFilterValue,
  setHoveredFeatures,
  setOther,
  setVisibility,
  toggleExtrudedMode,
  setState,
} from './layers.slice';

const LAYER_ID = 'test/layer';

describe('layers slice', () => {
  describe('actions', () => {
    describe.each`
      action                | stateKey             | newValue
      ${setClickedFeatures} | ${'clickedFeatures'} | ${[4, 5, 6]}
      ${setHoveredFeatures} | ${'hoveredFeatures'} | ${[4, 5, 6]}
      ${setVisibility}      | ${'visible'}         | ${true}
      ${setFilterValue}     | ${'filterValue'}     | ${['this', 'is', 'the', 'way']}
      ${setOther}           | ${'other'}           | ${{ this: 'is something', andThis: 'is something else' }}
    `('$action.type', ({ action, stateKey, newValue }) => {
      const expected = { [LAYER_ID]: { [stateKey]: newValue } },
        payload = {
          key: LAYER_ID,
          [stateKey]: newValue,
        };

      it(`Sets ${stateKey} for the given source_id in state`, () => {
        const state = {
          layers: { [LAYER_ID]: { [stateKey]: [1, 2, 3] } },
        };
        const result = reducer(state, action(payload));
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it(`Sets ${stateKey} even if it's undefined in state`, () => {
        const state = {
          layers: { [LAYER_ID]: {} },
        };
        const result = reducer(state, action(payload));
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it(`Sets ${stateKey} if the layer state is undefined`, () => {
        const state = { layers: {} };
        const result = reducer(state, action(payload));
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it(`Sets ${stateKey} even if it's undefined in payload`, () => {
        const state = {
          [LAYER_ID]: { [stateKey]: [1, 2, 3] },
        };
        const expected = {
          [LAYER_ID]: { [stateKey]: undefined },
        };
        const result = reducer(
          state,
          action({
            key: LAYER_ID,
            [stateKey]: undefined,
          }),
        );
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it('Prints and error to the console and does nothing if key is undefined', () => {
        const state = {
          [LAYER_ID]: {
            [stateKey]: [1, 2, 3],
          },
        };
        console.error = jest.fn();
        const result = reducer(
          state,
          action({
            key: undefined,
            [stateKey]: newValue,
          }),
        );
        expect(console.error).toHaveBeenCalledWith(
          'payload.key does not exist. Key must be provided to set state',
        );
        expect(result).toEqual(expect.objectContaining(state));
      });
    });

    describe('addClickedFeatures', () => {
      const key = 'test/layer',
        uniquePropertyPath = 'object.properties.index';
      it("Sets clickedFeatures in state if it's undefined", () => {
        const payload = {
          key,
          uniquePropertyPath,
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
        const result = reducer({}, addClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({
            [key]: { clickedFeatures: payload.clickedFeatures },
          }),
        );
      });

      it('Combines existing clicked features with the new ones', () => {
        const payload = {
          key,
          uniquePropertyPath,
          clickedFeatures: [
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
          ],
        };
        const state = {
          [key]: {
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
          },
        };
        const result = reducer(state, addClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({
            [key]: {
              clickedFeatures: expect.arrayContaining([
                ...state[key].clickedFeatures,
                ...payload.clickedFeatures,
              ]),
            },
          }),
        );
      });

      it('Does not duplicate features base on their unique property', () => {
        const payload = {
          key,
          uniquePropertyPath,
          clickedFeatures: [
            {
              object: {
                properties: {
                  index: 1,
                },
              },
            },
          ],
        };
        const state = {
          [key]: {
            clickedFeatures: [{ object: { properties: { index: 1 } } }],
          },
        };
        const result = reducer(state, addClickedFeatures(payload));
        expect(result).toEqual(state);
      });
    });

    describe('removeClickedFeatures', () => {
      const key = 'test/layer',
        uniquePropertyPath = 'object.properties.index';
      it('Removes all clickedFeatures from state', () => {
        const payload = {
          key,
          uniquePropertyPath,
          clickedFeatures: [
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
        const state = {
          [key]: {
            clickedFeatures: [
              {
                object: {
                  properties: {
                    index: 1,
                  },
                },
              },
              ...payload.clickedFeatures,
            ],
          },
        };
        const result = reducer(state, removeClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({
            [key]: {
              clickedFeatures: [
                {
                  object: { properties: { index: 1 } },
                },
              ],
            },
          }),
        );
      });

      it('Sets clickedFeatures to undefined if all features are removed', () => {
        const feature = {
          key,
          uniquePropertyPath,
          clickedFeatures: [
            {
              object: { properties: { index: 1 } },
            },
          ],
        };
        const result = reducer(
          { clickedFeatures: feature },
          removeClickedFeatures(feature),
        );
        expect(result).toEqual(
          expect.objectContaining({ [key]: { clickedFeatures: undefined } }),
        );
      });
    });

    describe('toggleExtrudedMode', () => {
      it.each`
        original     | result
        ${false}     | ${true}
        ${true}      | ${false}
        ${undefined} | ${true}
      `('Sets extrudedMode to $result if $original', ({ result, original }) => {
        const state = { extrudedMode: original },
          expected = { extrudedMode: result };
        expect(reducer(state, toggleExtrudedMode())).toEqual(
          expect.objectContaining(expected),
        );
      });
    });

    describe('setExtrusionScale', () => {
      it('Sets extrusionScale in state', () => {
        const state = { extrusionScale: 50 },
          expected = { extrusionScale: 100 };
        const result = reducer(state, setExtrusionScale(100));
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it('Sets extrusionScale if undefined', () => {
        const state = {},
          expected = { extrusionScale: 50 };
        const result = reducer(state, setExtrusionScale(50));
        expect(result).toEqual(expect.objectContaining(expected));
      });
    });

    describe('setState', () => {
      it('totally replaces the slice state', () => {
        const state = {
            extrusionScale: 1,
            extrudedMode: true,
            'test/layer': { stuff: 'things' },
            anotherKey: { moreThings: 'oh my' },
          },
          expected = {
            extrudedMode: false,
            extrusionScale: 3,
            'random/layer': { test: ['lions', 'tigers', 'bears'] },
            thisWasNotHereBefore: { neitherWasThis: true },
          };
        const result = reducer(state, setState(expected));
        expect(result).toEqual(expected);
      });
    });
  });

  describe('selectors', () => {
    describe.each`
      selector                   | stateKey             | undefinedReturn
      ${clickedFeaturesSelector} | ${'clickedFeatures'} | ${undefined}
      ${hoveredFeaturesSelector} | ${'hoveredFeatures'} | ${undefined}
      ${visibilitySelector}      | ${'visible'}         | ${true}
      ${filterValueSelector}     | ${'filterValue'}     | ${undefined}
      ${otherSelector}           | ${'other'}           | ${undefined}
    `('$selector.name', ({ selector, stateKey, undefinedReturn }) => {
      it(`Returns ${stateKey} for the given layer`, () => {
        const value = [1, 2, 3];
        const state = { layers: { [LAYER_ID]: { [stateKey]: value } } };
        expect(selector(LAYER_ID)(state)).toEqual(value);
      });

      it(`Returns undefined if layer state is undefined`, () => {
        const state = { layers: {} };
        expect(selector(LAYER_ID)(state)).toBe(undefinedReturn);
      });
    });

    describe.each`
      selector                  | stateKey            | value
      ${extrudedModeSelector}   | ${'extrudedMode'}   | ${false}
      ${extrusionScaleSelector} | ${'extrusionScale'} | ${50}
    `('$selector.name', ({ selector, stateKey, value }) => {
      it('returns extrudedMode from state', () => {
        const state = {
          layers: { [stateKey]: value },
        };
        const result = selector(state);
        expect(result).toBe(value);
      });

      it('returns undefined if state is undefined', () => {
        const state = {};
        const result = selector(state);
        expect(result).toBeUndefined();
      });
    });
  });
});
