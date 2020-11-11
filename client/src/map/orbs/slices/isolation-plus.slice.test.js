import reducer, {
  propertySelector,
  setProperty,
  filterRangeSelector,
  setFilterRange,
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
    });

    describe('setFilterRange', () => {
      it('sets the filter range in state', () => {
        const payload = [1, 2];
        const result = reducer({}, setFilterRange(payload));
        expect(result).toEqual({ filterRange: payload });
      });

      it('rounds the values', () => {
        const payload = [1.1, 2.9];
        const result = reducer({}, setFilterRange(payload));
        expect(result).toEqual({ filterRange: [1, 3] });
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
