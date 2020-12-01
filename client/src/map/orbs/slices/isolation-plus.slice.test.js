import reducer, {
  propertySelector,
  setProperty,
  filterDataSelector,
  setFilterData,
} from './isolation-plus.slice';

import { DEFAULT_CLIP_POSITION } from './isolation-plus-constants';

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

        const expected = {
          filterRange: [0, 200],
          clipPosition: DEFAULT_CLIP_POSITION,
        };

        const result = reducer(state, setProperty(payload));
        expect(result.filterData).toEqual(expected);
      });
    });

    describe('setFilterData', () => {
      it('sets the filter data in state', () => {
        const payload = {
          filterRange: [1, 2],
          clipPosition: { translateX: 1, clipWidth: 2 },
        };
        const result = reducer({}, setFilterData(payload));
        expect(result).toEqual({ filterData: payload });
      });

      it('rounds the values', () => {
        const payload = {
          filterRange: [1.1, 2.9],
          clipPosition: { translateX: 1, clipWidth: 2 },
        };
        const result = reducer({}, setFilterData(payload));
        expect(result).toEqual({
          filterData: {
            filterRange: [1, 3],
            clipPosition: { translateX: 1, clipWidth: 2 },
          },
        });
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

    describe('filterDataSelector', () => {
      it('returns undefined if isolationPlus state is undefined', () => {
        const state = {};
        const result = filterDataSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns filterData from state', () => {
        const filterData = {
          filterData: [1, 2],
          clipPosition: { translateX: 1, clipwidth: 2 },
        };
        const state = { isolationPlus: { filterData } };
        const result = filterDataSelector(state);
        expect(result).toEqual(filterData);
      });
    });
  });
});
