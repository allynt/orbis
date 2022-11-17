// @ts-nocheck

import reducer, {
  setFilterValues,
  setFilterValue,
  setClipValue,
  setSelectedProperty,
  crossFilterValuesSelector,
  selectedPropertySelector,
} from './crossfilter-layers.slice';

const errorMessage =
  'payload.key does not exist. Key must be provided to set state';

describe('crossfilter-layers slice', () => {
  describe('actions', () => {
    describe('setFilterValues', () => {
      it('initialises filter values in state', () => {
        const crossFilterValues = {
          property1: { filterValue: [10, 99], clipValue: [22, 88] },
          property2: { filterValue: [33, 44], clipValue: [11, 99] },
        };

        const initialState = {
          selectedProperty: null,
          crossFilterValues: {},
        };

        const payload = {
          key: 'crossFilterValues',
          crossFilterValues,
        };

        const result = reducer(initialState, setFilterValues(payload));
        expect(result).toEqual({
          ...initialState,
          crossFilterValues,
        });
      });

      it('logs error if no key found', () => {
        console.error = jest.fn();

        const initialState = { crossFilterValues: {} };

        const payload = {
          crossFilterValues: {
            property1: { filterValue: [10, 99] },
          },
        };

        const result = reducer(initialState, setFilterValues(payload));

        expect(result).toEqual(initialState);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('setFilterValue', () => {
      it('updates an individual filter value', () => {
        const initialState = {
          selectedProperty: null,
          crossFilterValues: {
            property1: { filterValue: [10, 99] },
          },
        };

        const payload = {
          key: 'crossFilterValues',
          propertyName: 'property2',
          filterValue: [33, 44],
        };

        const result = reducer(initialState, setFilterValue(payload));

        expect(result).toEqual({
          ...initialState,
          crossFilterValues: {
            property1: { filterValue: [10, 99] },
            property2: { filterValue: [33, 44] },
          },
        });
      });

      it('logs error if no key found', () => {
        console.error = jest.fn();

        const initialState = { crossFilterValues: {} };

        const payload = {
          propertyName: 'property1',
          filterValue: { filterValue: [33, 44] },
        };

        const result = reducer(initialState, setFilterValue(payload));

        expect(result).toEqual(initialState);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('setClipValue', () => {
      it('updates an individual clip value', () => {
        const initialState = {
          selectedProperty: null,
          crossFilterValues: {
            property1: { clipValue: [10, 99] },
          },
        };

        const payload = {
          key: 'crossFilterValues',
          propertyName: 'property2',
          clipValue: [33, 44],
        };

        const result = reducer(initialState, setClipValue(payload));

        expect(result).toEqual({
          ...initialState,
          crossFilterValues: {
            property1: { clipValue: [10, 99] },
            property2: { clipValue: [33, 44] },
          },
        });
      });

      it('logs error if no key found', () => {
        console.error = jest.fn();

        const initialState = { crossFilterValues: {} };

        const payload = {
          propertyName: 'property1',
          filterValue: { clipValue: [33, 44] },
        };

        const result = reducer(initialState, setClipValue(payload));

        expect(result).toEqual(initialState);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('setSelectedProperty', () => {
      it('sets the selected property', () => {
        const selectedProperty = { name: 'test-property' };

        const initialState = {
          selectedProperty: null,
          crossFilterValues: {},
        };

        const payload = {
          key: 'selectedProperty',
          selectedProperty,
        };

        const result = reducer(initialState, setSelectedProperty(payload));

        expect(result).toEqual({
          ...initialState,
          selectedProperty,
        });
      });

      it('logs error if no key found', () => {
        console.error = jest.fn();

        const initialState = { selectedProperty: null };

        const payload = {
          selectedProperty: { name: 'test-property' },
        };

        const result = reducer(initialState, setFilterValue(payload));

        expect(result).toEqual(initialState);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('selectors', () => {
    describe('crossFilterValuesSelector', () => {
      it('selects the cross-filter values', () => {
        const crossFilterValues = {
          property1: { filterValue: [12, 34] },
          property2: { filterValue: [56, 78] },
        };

        const state = {
          crossFilterLayers: {
            crossFilterValues,
          },
        };

        const result = crossFilterValuesSelector(state);
        expect(result).toEqual(crossFilterValues);
      });

      it('returns undefined if state is undefined', () => {
        const result = crossFilterValuesSelector(undefined);
        expect(result).toBeUndefined();
      });
    });

    describe('selectedPropertySelector', () => {
      it('selects the selected property', () => {
        const selectedProperty = { name: 'test-property' };

        const state = {
          crossFilterLayers: {
            selectedProperty,
          },
        };

        const result = selectedPropertySelector(state);
        expect(result).toEqual(selectedProperty);
      });

      it('returns undefined if state is undefined', () => {
        const result = selectedPropertySelector(undefined);
        expect(result).toBeUndefined();
      });
    });
  });
});
