import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer, { addLayers, removeLayer, fetchSourcesFailure, fetchSourcesSuccess, fetchSources } from './data.slice';

const mockStore = configureMockStore([thunk]);

describe('Dat Layers Slice', () => {
  describe('actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: { userKey: 'Test-User-Key' }
      });
    });

    it('should dispatch fetch sources failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message'
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error'
        }
      );

      const expectedActions = [{ type: fetchSourcesFailure.type, payload: { message: '401 Test Error' } }];

      await store.dispatch(fetchSources());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch sources success action.', async () => {
      const data = {
        token: 'Test Token',
        timeout: 60,
        sources: [
          {
            id: 1,
            metadata: {
              domain: 'Test Domain 1'
            }
          },
          {
            id: 2,
            metadata: {
              domains: 'Test Domain 2'
            }
          }
        ]
      };
      const domains = Array.from(new Set(data.sources.map(source => source.metadata.domain)));

      fetch.mockResponse(JSON.stringify(data));

      const expectedActions = [{ type: fetchSourcesSuccess.type, payload: { domains, ...data } }];

      await store.dispatch(fetchSources());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  describe('Dat Layers Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        layers: [],
        dataSources: null,
        token: null,
        domains: [],
        pollingPeriod: 30000
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

    it('should update the sources in state, when successfully retrieved', () => {
      const data = {
        token: 'Test Token',
        timeout: 60,
        sources: [
          {
            id: 1,
            metadata: {
              domain: 'Test Domain 1'
            }
          },
          {
            id: 2,
            metadata: {
              domain: 'Test Domain 2'
            }
          }
        ]
      };
      const timeoutInMilliseconds = (data.timeout * 60 * 1000) / 2;
      const domains = Array.from(new Set(data.sources.map(source => source.metadata.domain)));

      const actualState = reducer(beforeState, {
        type: fetchSourcesSuccess.type,
        payload: { ...data, domains }
      });

      expect(actualState.token).toEqual(data.token);
      expect(actualState.pollingPeriod).toEqual(timeoutInMilliseconds);
      expect(actualState.dataSources).toEqual(data.sources);
      expect(actualState.domains).toEqual(domains);
    });

    it('should update the error state, when failed to retrieve sources', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: fetchSourcesFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });
  });
});
