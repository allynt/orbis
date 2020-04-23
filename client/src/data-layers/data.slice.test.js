import reducer, { addLayers, removeLayer } from './data.slice';

describe('Dat Layers Slice', () => {
  describe('Dat Layers Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        layers: []
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the data layers in state, when none previously selected', () => {
      const layers = [{ name: 'Test Layer 1' }, { name: 'Test Layer 2' }];

      const actualState = reducer(beforeState, {
        type: addLayers.type,
        payload: layers
      });

      expect(actualState.layers).toEqual(layers);
    });

    it('should update the data layers in state, when layers previously selected', () => {
      beforeState.layers = [{ name: 'Test Layer 1' }, { name: 'Test Layer 2' }];
      const layers = [{ name: 'Test Layer 3' }, { name: 'Test Layer 4' }];

      const actualState = reducer(beforeState, {
        type: addLayers.type,
        payload: layers
      });

      expect(actualState.layers).toEqual([...beforeState.layers, ...layers]);
    });

    it('should update the data layers in state, when layers previously selected is removed', () => {
      beforeState.layers = [{ name: 'Test Layer 1' }, { name: 'Test Layer 2' }];
      const layer = { name: 'Test Layer 1' };

      const actualState = reducer(beforeState, {
        type: removeLayer.type,
        payload: layer
      });

      expect(actualState.layers).toEqual([beforeState.layers[1]]);
    });

    it("should not update the data layers in state, when layer selected doesn't exist", () => {
      beforeState.layers = [{ name: 'Test Layer 1' }, { name: 'Test Layer 2' }];
      const layer = { name: 'Test Layer 3' };

      const actualState = reducer(beforeState, {
        type: removeLayer.type,
        payload: layer
      });

      expect(actualState.layers).toEqual(beforeState.layers);
    });
  });
});
