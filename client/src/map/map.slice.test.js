import reducer, {
  selectMapStyle,
  toggleCompareMode,
  saveMap,
  isCompareModeSelector,
  selectedMapStyleSelector,
} from './map.slice';

describe('Map Slice', () => {
  describe('Map Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        selectedMapStyle: {},
        isCompareMode: false,
        saveMap: false,
        dimensions: {
          width: -1,
          height: -1,
        },
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the map style in state, when set', () => {
      const mapStyles = [
        {
          name: 'light',
          label: 'Light',
        },
        {
          name: 'light',
          label: 'Light',
        },
      ];
      const actualState = reducer(beforeState, {
        type: selectMapStyle.type,
        payload: mapStyles[1],
      });

      expect(actualState.selectedMapStyle).toEqual(mapStyles[1]);
    });

    it('should update the compare map state, when in comparison mode', () => {
      const actualState = reducer(beforeState, {
        type: toggleCompareMode.type,
      });

      expect(actualState.isCompareMode).toEqual(!beforeState.isCompareMode);
    });

    it('should update the saved map in state, when successfully called', () => {
      const actualState = reducer(beforeState, {
        type: saveMap.type,
      });

      expect(actualState.saveMap).toEqual(true);
    });
  });

  describe('selectors', () => {
    describe('isCompareModeSelector', () => {
      it('returns false if state is undefined', () => {
        const result = isCompareModeSelector();
        expect(result).toBe(false);
      });

      it('returns false if map is undefined', () => {
        const state = {};
        const result = isCompareModeSelector(state);
        expect(result).toBe(false);
      });

      it('returns false if isCompareMode is undefined', () => {
        const state = { map: {} };
        const result = isCompareModeSelector(state);
        expect(result).toBe(false);
      });

      it('returns isCompareMode', () => {
        const state = { map: { isCompareMode: true } };
        const result = isCompareModeSelector(state);
        expect(result).toEqual(state.map.isCompareMode);
      });
    });

    describe('selectedMapStyleSelector', () => {
      it('returns undefined if state is undefined', () => {
        const result = selectedMapStyleSelector();
        expect(result).toBeUndefined();
      });

      it('returns undefined if map is undefined', () => {
        const state = {};
        const result = selectedMapStyleSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if selectedMapStyle is undefined', () => {
        const state = { map: {} };
        const result = selectedMapStyleSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns selectedMapStyle', () => {
        const state = {
          map: {
            selectedMapStyle: { uri: 'hello' },
          },
        };
        const result = selectedMapStyleSelector(state);
        expect(result).toEqual(state.map.selectedMapStyle);
      });
    });
  });
});
