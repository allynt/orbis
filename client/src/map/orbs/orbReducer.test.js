// @ts-nocheck

import reducer, {
  clickedFeaturesSelector,
  extrudedModeSelector,
  extrusionScaleSelector,
  filterValueSelector,
  hoveredFeaturesSelector,
  layersVisibilitySelector,
  setClickedFeatures,
  setExtrusionScale,
  setFilterValue,
  setHoveredFeatures,
  setVisibility,
  toggleExtrudedMode,
} from './orbReducer';

const LAYER_ID = 'test/layer';

describe('orbReducer', () => {
  describe('actions', () => {
    describe.each`
      action                | stateKey             | newValue
      ${setClickedFeatures} | ${'clickedFeatures'} | ${[4, 5, 6]}
      ${setHoveredFeatures} | ${'hoveredFeatures'} | ${[4, 5, 6]}
      ${setVisibility}      | ${'visible'}         | ${true}
      ${setFilterValue}     | ${'filterValue'}     | ${['this', 'is', 'the', 'way']}
    `('$action.type', ({ action, stateKey, newValue }) => {
      const expected = {
          layers: { [LAYER_ID]: { [stateKey]: newValue } },
        },
        payload = {
          source_id: LAYER_ID,
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
          layers: { [LAYER_ID]: { [stateKey]: [1, 2, 3] } },
        };
        const expected = {
          layers: {
            [LAYER_ID]: { [stateKey]: undefined },
          },
        };
        const result = reducer(
          state,
          action({
            source_id: LAYER_ID,
            [stateKey]: undefined,
          }),
        );
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it('Prints and error to the console and does nothing if source_id is undefined', () => {
        const state = {
          layers: {
            [LAYER_ID]: {
              [stateKey]: [1, 2, 3],
            },
          },
        };
        console.error = jest.fn();
        const result = reducer(
          state,
          action({
            source_id: undefined,
            [stateKey]: newValue,
          }),
        );
        expect(console.error).toHaveBeenCalledWith(
          'payload.source_id does not exist',
        );
        expect(result).toEqual(expect.objectContaining(state));
      });
    });

    describe('toggleExtrudedMode', () => {
      it.each`
        original     | result
        ${false}     | ${true}
        ${true}      | ${false}
        ${undefined} | ${true}
      `('Sets extrudedMode to $result if $original', ({ result, original }) => {
        const state = { layers: { extrudedMode: original } },
          expected = { layers: { extrudedMode: result } };
        expect(reducer(state, toggleExtrudedMode())).toEqual(
          expect.objectContaining(expected),
        );
      });
    });

    describe('setExtrusionScale', () => {
      it('Sets extrusionScale in state', () => {
        const state = { layers: { extrusionScale: 50 } },
          expected = { layers: { extrusionScale: 100 } };
        const result = reducer(state, setExtrusionScale(100));
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it('Sets extrusionScale if undefined', () => {
        const state = { layers: {} },
          expected = { layers: { extrusionScale: 50 } };
        const result = reducer(state, setExtrusionScale(50));
        expect(result).toEqual(expect.objectContaining(expected));
      });
    });
  });

  describe('selectors', () => {
    describe.each`
      selector                    | stateKey             | undefinedReturn
      ${clickedFeaturesSelector}  | ${'clickedFeatures'} | ${undefined}
      ${hoveredFeaturesSelector}  | ${'hoveredFeatures'} | ${undefined}
      ${layersVisibilitySelector} | ${'visible'}         | ${true}
      ${filterValueSelector}      | ${'filterValue'}     | ${undefined}
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
