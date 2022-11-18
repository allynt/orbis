// @ts-nocheck

import reducer, {
  setInitialCrossFilterRanges,
  setFilterRange,
  setClipRange,
  setSelectedProperty,
  crossFilterRangesSelector,
  selectedPropertySelector,
} from './crossfilter-layers.slice';

const errorMessage =
  'payload.key does not exist. Key must be provided to set state';

describe('crossfilter-layers slice', () => {
  describe('actions', () => {
    describe('setInitialCrossFilterRanges', () => {
      it('initialises filter values in state', () => {
        const crossFilterRanges = {
          property1: { filterRange: [10, 99], clipRange: [22, 88] },
          property2: { filterRange: [33, 44], clipRange: [11, 99] },
        };

        const initialState = {
          selectedProperty: null,
          crossFilterRanges: {},
        };

        const payload = {
          key: 'crossFilterRanges',
          crossFilterRanges,
        };

        const result = reducer(
          initialState,
          setInitialCrossFilterRanges(payload),
        );
        expect(result).toEqual({
          ...initialState,
          crossFilterRanges,
        });
      });

      it('logs error if no key found', () => {
        console.error = jest.fn();

        const initialState = { crossFilterRanges: {} };

        const payload = {
          crossFilterRanges: {
            property1: { filterRange: [10, 99] },
          },
        };

        const result = reducer(
          initialState,
          setInitialCrossFilterRanges(payload),
        );

        expect(result).toEqual(initialState);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('setFilterRange', () => {
      it('updates an individual filter value', () => {
        const initialState = {
          selectedProperty: null,
          crossFilterRanges: {
            property1: { filterRange: [10, 99] },
          },
        };

        const payload = {
          key: 'crossFilterRanges',
          propertyName: 'property2',
          filterRange: [33, 44],
        };

        const result = reducer(initialState, setFilterRange(payload));

        expect(result).toEqual({
          ...initialState,
          crossFilterRanges: {
            property1: { filterRange: [10, 99] },
            property2: { filterRange: [33, 44] },
          },
        });
      });

      it('logs error if no key found', () => {
        console.error = jest.fn();

        const initialState = { crossFilterRanges: {} };

        const payload = {
          propertyName: 'property1',
          filterRange: { filterRange: [33, 44] },
        };

        const result = reducer(initialState, setFilterRange(payload));

        expect(result).toEqual(initialState);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('setClipRange', () => {
      it('updates an individual clip value', () => {
        const initialState = {
          selectedProperty: null,
          crossFilterRanges: {
            property1: { clipRange: [10, 99] },
          },
        };

        const payload = {
          key: 'crossFilterRanges',
          propertyName: 'property2',
          clipRange: [33, 44],
        };

        const result = reducer(initialState, setClipRange(payload));

        expect(result).toEqual({
          ...initialState,
          crossFilterRanges: {
            property1: { clipRange: [10, 99] },
            property2: { clipRange: [33, 44] },
          },
        });
      });

      it('logs error if no key found', () => {
        console.error = jest.fn();

        const initialState = { crossFilterRanges: {} };

        const payload = {
          propertyName: 'property1',
          filterRange: { clipRange: [33, 44] },
        };

        const result = reducer(initialState, setClipRange(payload));

        expect(result).toEqual(initialState);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('setSelectedProperty', () => {
      it('sets the selected property', () => {
        const selectedProperty = { name: 'test-property' };

        const initialState = {
          selectedProperty: null,
          crossFilterRanges: {},
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

        const result = reducer(initialState, setFilterRange(payload));

        expect(result).toEqual(initialState);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('selectors', () => {
    describe('crossFilterRangesSelector', () => {
      it('selects the cross-filter values', () => {
        const crossFilterRanges = {
          property1: { filterRange: [12, 34] },
          property2: { filterRange: [56, 78] },
        };

        const state = {
          crossFilterLayers: {
            crossFilterRanges,
          },
        };

        const result = crossFilterRangesSelector(state);
        expect(result).toEqual(crossFilterRanges);
      });

      it('returns undefined if state is undefined', () => {
        const result = crossFilterRangesSelector(undefined);
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
