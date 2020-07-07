import reducer, {
  setViewport,
  selectMapStyle,
  toggleCompareMode,
  saveMap,
} from './map.slice';

describe('Map Slice', () => {
  describe('Map Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        viewport: { zoom: 6, center: [-4.84, 54.71] },
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
      const viewport = {
        center: [-4.84, 54.71],
        zoom: 6,
      };
      const actualState = reducer(beforeState, {
        type: setViewport.type,
        payload: null,
      });

      expect(actualState.viewport).toEqual(viewport);
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
});
