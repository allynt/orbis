import reducer, {
  setViewport,
  selectMapStyle,
  toggleCompareMode,
  saveMap,
  isCompareModeSelector,
} from './map.slice';

describe('Map Slice', () => {
  describe('Map Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        viewport: {
          zoom: 6,
          longitude: -4.84,
          latitude: 54.71,
          pitch: 0,
          bearing: 0,
        },
        mapStyles: [],
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

    it("should not update the viewport in state, when value doesn't exist", () => {
      const actualState = reducer(beforeState, {
        type: setViewport.type,
        payload: null,
      });

      expect(actualState.viewport).toEqual(beforeState.viewport);
    });

    it('should update the viewport in state, when value exists', () => {
      const viewport = {
        center: { lng: -4.84, lat: 54.71 },
        zoom: 5,
      };
      const actualState = reducer(beforeState, {
        type: setViewport.type,
        payload: viewport,
      });

      expect(actualState.viewport).toEqual(viewport);
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
  });
});
