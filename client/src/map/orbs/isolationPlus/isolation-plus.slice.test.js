import reducer, { propertySelector, setProperty } from './isolation-plus.slice';

describe('isolationPlusSlice', () => {
  describe('reducer', () => {
    describe('setProperty', () => {
      it("does not set a property if it's undefined in the payload", () => {
        const state = {};
        const payload = { source_id: 'test/layer' };
        const result = reducer(state, setProperty(payload));
        expect(result).toEqual(state);
      });

      it('does not set a property if source_id is undefined in the payload', () => {
        const state = {};
        const payload = { property: 'hello' };
        const result = reducer(state, setProperty(payload));
        expect(result).toEqual(state);
      });

      it('sets the property for a source in state if not yet defined', () => {
        const state = {};
        const expected = { 'test/layer': 'hello' };
        const payload = { source_id: 'test/layer', property: 'hello' };
        const result = reducer(state, setProperty(payload));
        expect(result).toEqual(expected);
      });

      it('overwrites the property for a source in state if it exists', () => {
        const state = {
          'test/layer': 'no thanks',
        };
        const expected = { 'test/layer': 'hello' };
        const payload = { source_id: 'test/layer', property: 'hello' };
        const result = reducer(state, setProperty(payload));
        expect(result).toEqual(expected);
      });
    });
  });

  describe('selectors', () => {
    describe('propertySelector', () => {
      it('returns the property for the specified layer', () => {
        const state = {
          orbs: {
            isolationPlus: {
              'test/layer': 'hello',
            },
          },
        };
        const result = propertySelector(state, 'test/layer');
        expect(result).toEqual(state.orbs.isolationPlus['test/layer']);
      });

      it('returns undefined if state is undefined', () => {
        const result = propertySelector(undefined, 'test/layer');
        expect(result).toBeUndefined();
      });

      it('returns undefined if orbs is undefined', () => {
        const result = propertySelector({}, 'test/layer');
        expect(result).toBeUndefined();
      });

      it('returns undefined if isolationPlus is undefined', () => {
        const result = propertySelector({ orbs: {} }, 'test/layer');
        expect(result).toBeUndefined();
      });

      it('returns undefined if the layer is undefined in state', () => {
        const result = propertySelector(
          { orbs: { isolationPlus: {} } },
          'test/layer',
        );
        expect(result).toBeUndefined();
      });

      it('returns undefined if source_id is undefined', () => {
        const result = propertySelector({
          orbs: { isolationPlus: { 'test/layer': 'hello' } },
        });
        expect(result).toBeUndefined();
      });
    });
  });
});
