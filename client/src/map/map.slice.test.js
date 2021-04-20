import reducer, {
  selectMapStyle,
  toggleCompareMode,
  saveMap,
  isCompareModeSelector,
  selectedMapStyleSelector,
  selectedMapStyleIdSelector,
  initialState,
  topMapLayerGroupsSelector,
  setIsLoading,
  isLoadingSelector,
} from './map.slice';

describe('Map Slice', () => {
  describe('Map Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = initialState;
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

    it('Updates isLoading in state', () => {
      const actualState = reducer(beforeState, setIsLoading(true));
      expect(actualState.isLoading).toBe(true);
    });
  });

  describe('selectors', () => {
    describe('isCompareModeSelector', () => {
      it('returns false if state is undefined', () => {
        const result = isCompareModeSelector(undefined);
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

    describe('selectedMapStyleIdSelector', () => {
      it('returns the id from state', () => {
        expect(
          selectedMapStyleIdSelector({
            map: { selectedMapStyle: 'something' },
          }),
        ).toBe('something');
      });
    });

    describe('selectedMapStyleSelector', () => {
      it('returns undefined if state is undefined', () => {
        const result = selectedMapStyleSelector(undefined);
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
            selectedMapStyle: 'test',
            mapStyles: {
              test: { style: {} },
            },
            topMapLayerGroups: [],
          },
        };
        const expected = {
          id: 'test',
          topMapStyle: { layers: [] },
          bottomMapStyle: state.map.mapStyles.test.style,
        };
        const result = selectedMapStyleSelector(state);
        expect(result).toEqual(expected);
      });
    });

    describe('isLoadingSelector', () => {
      it('returns isLoading from state', () => {
        const result = isLoadingSelector({
          map: {
            isLoading: 'yes',
          },
        });
        expect(result).toBe('yes');
      });
    });

    describe('topMapLayerGroupsSelector', () => {
      it('returns an empty array if state is undefined', () => {
        const result = topMapLayerGroupsSelector(undefined);
        expect(result).toEqual([]);
      });

      it('returns an empty array if map is undefined', () => {
        const result = topMapLayerGroupsSelector({});
        expect(result).toEqual([]);
      });

      it('returns an empty array if topMapLayerGroups is undefined', () => {
        const result = topMapLayerGroupsSelector({ map: {} });
        expect(result).toEqual([]);
      });

      it('returns topMapLayerGroups', () => {
        const topMapLayerGroups = ['labels', 'roads'];
        const result = topMapLayerGroupsSelector({
          map: { topMapLayerGroups },
        });
        expect(result).toEqual(topMapLayerGroups);
      });
    });
  });
});
