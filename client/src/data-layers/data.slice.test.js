import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer, {
  addLayers,
  removeLayer,
  fetchSourcesFailure,
  fetchSourcesSuccess,
  fetchSources,
  selectDomainList,
  selectDataSources
} from './data.slice';

const mockStore = configureMockStore([thunk]);

describe('Data Slice', () => {
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

      fetch.mockResponse(JSON.stringify(data));

      const expectedActions = [{ type: fetchSourcesSuccess.type, payload: data }];

      await store.dispatch(fetchSources());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  describe('reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        layers: [],
        sources: null,
        token: null,
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

      const actualState = reducer(beforeState, {
        type: fetchSourcesSuccess.type,
        payload: data
      });

      expect(actualState.token).toEqual(data.token);
      expect(actualState.pollingPeriod).toEqual(timeoutInMilliseconds);
      expect(actualState.sources).toEqual(data.sources);
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

  describe('selectors', () => {
    describe('selectDataSources', () => {
      it('should return the list of data sources', () => {
        const state = {
          data: {
            sources: [{ name: 'source 1' }, { name: 'source 2' }, { name: 'source 3' }]
          }
        };
        const result = selectDataSources(state);
        expect(result).toEqual(state.data.sources);
      });

      it('should return an empty array if no data state is present', () => {
        const state = {};
        const result = selectDataSources(state);
        expect(result).toEqual([]);
      });

      it('should return an empty array if no sources are present', () => {
        const state = { data: {} };
        const result = selectDataSources(state);
        expect(result).toEqual([]);
      });
    });

    describe('selectDomainList', () => {
      it('should return a list of domains from the data sources list', () => {
        const state = {
          data: {
            sources: [
              {
                metadata: {
                  domain: 'Domain 1'
                }
              },
              {
                metadata: {
                  domain: 'Domain 2'
                }
              },
              {
                metadata: {
                  domain: 'Domain 3'
                }
              }
            ]
          }
        };
        const expected = [
          state.data.sources[0].metadata.domain,
          state.data.sources[1].metadata.domain,
          state.data.sources[2].metadata.domain
        ];

        const result = selectDomainList(state);
        expect(result).toEqual(expected);
      });

      it('should not contain duplicates', () => {
        const state = {
          data: {
            sources: [
              {
                metadata: {
                  domain: 'Domain 1'
                }
              },
              {
                metadata: {
                  domain: 'Domain 1'
                }
              },
              {
                metadata: {
                  domain: 'Domain 2'
                }
              },
              {
                metadata: {
                  domain: 'Domain 3'
                }
              },
              {
                metadata: {
                  domain: 'Domain 3'
                }
              }
            ]
          }
        };
        const expected = ['Domain 1', 'Domain 2', 'Domain 3'];
        const notExpected = ['Domain 1', 'Domain 1', 'Domain 2', 'Domain 3', 'Domain 3'];
        const result = selectDomainList(state);
        expect(result.sort()).toEqual(expected.sort());
        expect(result.sort()).not.toEqual(notExpected.sort());
      });

      it('should return an empty array if no data state is present', () => {
        const state = {};
        const result = selectDomainList(state);
        expect(result).toEqual([]);
      });

      it('should return an empty array if no sources are present', () => {
        const state = { data: {} };
        const result = selectDomainList(state);
        expect(result).toEqual([]);
      });

      it('should return an empty array if sources is an empty array', () => {
        const state = {
          data: {
            sources: []
          }
        };
        const result = selectDomainList(state);
        expect(result).toEqual([]);
      });

      it('should return an empty array if no sources have a metadata property', () => {
        const state = {
          data: {
            sources: [{}, {}, {}]
          }
        };
        const result = selectDomainList(state);
        expect(result).toEqual([]);
      });

      it('should return an empty array if no sources have a domain property', () => {
        const state = {
          data: {
            sources: [{ metadata: {} }, { metadata: {} }, { metadata: {} }]
          }
        };
        const result = selectDomainList(state);
        expect(result).toEqual([]);
      });
    });
  });
});
