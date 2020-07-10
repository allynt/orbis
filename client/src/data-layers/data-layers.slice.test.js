import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer, {
  addLayers,
  removeLayer,
  fetchSourcesFailure,
  fetchSourcesSuccess,
  fetchSources,
  selectDomainList,
  selectActiveSources,
  selectDataSources,
  selectPollingPeriod,
  selectDataToken,
} from './data-layers.slice';

const mockStore = configureMockStore([thunk]);

describe('Data Slice', () => {
  describe('thunks', () => {
    describe('fetchSources', () => {
      let store = null;

      beforeEach(() => {
        fetch.resetMocks();

        store = mockStore({
          accounts: { userKey: 'Test-User-Key' },
        });
      });

      it('should dispatch fetch sources failure action.', async () => {
        fetch.mockResponse(
          JSON.stringify({
            message: 'Test error message',
          }),
          {
            ok: false,
            status: 401,
            statusText: 'Test Error',
          },
        );

        const expectedActions = [
          {
            type: fetchSourcesFailure.type,
            payload: { message: '401 Test Error' },
          },
        ];

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
                domain: 'Test Domain 1',
              },
            },
            {
              id: 2,
              metadata: {
                domains: 'Test Domain 2',
              },
            },
          ],
        };

        fetch.mockResponse(JSON.stringify(data));

        const expectedActions = [
          { type: fetchSourcesSuccess.type, payload: data },
        ];

        await store.dispatch(fetchSources());

        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        layers: {},
        sources: null,
        token: null,
        pollingPeriod: 30000,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    describe('addLayers', () => {
      it('adds a layer', () => {
        const layers = ['test/layer/1'];
        const actualState = reducer(beforeState, addLayers(layers));
        expect(actualState.layers[layers[0]]).toBeTruthy();
      });

      it('adds a layer when the payload is an object', () => {
        const layer = { source_id: 'test/layer/1' };
        const actualState = reducer(beforeState, addLayers([layer]));
        expect(actualState.layers[layer.source_id]).toBeTruthy();
      });

      it("sets a layer to loaded if it wasn't previously", () => {
        const layer = 'test/layer/1';
        const result = reducer(beforeState, addLayers([layer]));
        expect(result.layers[layer].loaded).toBe(true);
      });

      it('sets a layer to visible', () => {
        const layer = 'test/layer/1';
        const result = reducer(beforeState, addLayers([layer]));
        expect(result.layers[layer].visible).toBe(true);
      });

      it('sets a layer to visible if it has been loaded and hidden', () => {
        const state = {
          layers: { 'test/layer/1': { loaded: true, visible: false } },
        };
        const expected = { 'test/layer/1': { loaded: true, visible: true } };
        const result = reducer(state, addLayers(['test/layer/1']));
        expect(result.layers).toEqual(expected);
      });

      it('adds layers alongside previously selected layers', () => {
        const state = {
          layers: {
            'test/layer/1': {
              loaded: true,
              visible: true,
            },
            'test/layer/2': {
              loaded: true,
              visible: false,
            },
          },
        };
        const layers = ['test/layer/4', 'test/layer/3'];
        const expected = {
          ...state.layers,
          'test/layer/3': {
            loaded: true,
            visible: true,
          },
          'test/layer/4': {
            loaded: true,
            visible: true,
          },
        };
        const result = reducer(state, addLayers(layers));
        expect(result.layers).toEqual(expected);
      });
    });

    describe('removeLayer', () => {
      it('does nothing if the layer being removed does not exist', () => {
        const state = {
          layers: {},
        };
        const layer = 'test/layer/1';
        const actualState = reducer(state, removeLayer(layer));
        expect(actualState).toEqual(state);
      });

      it("sets the layer's visible property to false", () => {
        const state = {
          layers: {
            'test/layer/1': { loaded: true, visible: true },
          },
        };
        const expected = {
          'test/layer/1': { loaded: true, visible: false },
        };
        const layer = 'test/layer/1';
        const result = reducer(state, removeLayer(layer));
        expect(result.layers).toEqual(expected);
      });

      it('should remove layers when an object is received', () => {
        const state = {
          layers: {
            'test/layer/1': { loaded: true, visible: true },
            'test/layer/2': { loaded: true, visible: true },
          },
        };
        const layer = { source_id: 'test/layer/2' };
        const result = reducer(state, removeLayer(layer));
        expect(result.layers[layer.source_id].visible).toBe(false);
      });

      it('does not affect other layers', () => {
        const state = {
          layers: {
            'test/layer/1': { loaded: true, visible: true },
            'test/layer/2': { loaded: true, visible: true },
          },
        };
        const expected = {
          layers: {
            'test/layer/1': { loaded: true, visible: false },
            'test/layer/2': { loaded: true, visible: true },
          },
        };
        const result = reducer(state, removeLayer('test/layer/1'));
        expect(result).toEqual(expected);
      });
    });

    describe('fetchSourcesSuccess', () => {
      it('should update the sources in state, when successfully retrieved', () => {
        const data = {
          token: 'Test Token',
          timeout: 60,
          sources: [
            {
              id: 1,
              metadata: {
                domain: 'Test Domain 1',
              },
            },
            {
              id: 2,
              metadata: {
                domain: 'Test Domain 2',
              },
            },
          ],
        };
        const timeoutInMilliseconds = (data.timeout * 60 * 1000) / 2;

        const actualState = reducer(beforeState, {
          type: fetchSourcesSuccess.type,
          payload: data,
        });

        expect(actualState.token).toEqual(data.token);
        expect(actualState.pollingPeriod).toEqual(timeoutInMilliseconds);
        expect(actualState.sources).toEqual(data.sources);
      });
    });

    describe('fetchSourcesFailure', () => {
      it('should update the error state, when failed to retrieve sources', () => {
        const error = { message: 'Test Bookmarks Error' };

        const actualState = reducer(beforeState, {
          type: fetchSourcesFailure.type,
          payload: error,
        });

        expect(actualState.error).toEqual(error);
      });
    });
  });

  describe('selectors', () => {
    describe('selectDataToken', () => {
      it('should return the data token from state', () => {
        const state = {
          data: {
            token: `If there's a place you got to go
            I'm the one you need to know
            I'm the token
            I'm the token
            I'm the token
            oh oh oh
            I'm the token
            `,
          },
        };
        const result = selectDataToken(state);
        expect(result).toBe(state.data.token);
      });

      it('should return an empty string if no data state is present', () => {
        const state = {};
        const result = selectDataToken(state);
        expect(result).toBe('');
      });

      it('should return an empty string if no token is present', () => {
        const state = {
          data: {},
        };
        const result = selectDataToken(state);
        expect(result).toBe('');
      });
    });

    describe('selectPollingPeriod', () => {
      it('should return the polling period from state', () => {
        const state = {
          data: {
            pollingPeriod: 1,
          },
        };
        const result = selectPollingPeriod(state);
        expect(result).toBe(state.data.pollingPeriod);
      });

      it('returns undefined if no data state is present', () => {
        const state = {};
        const result = selectPollingPeriod(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if no polling period is present', () => {
        const state = {
          data: {},
        };
        const result = selectPollingPeriod(state);
        expect(result).toBeUndefined();
      });
    });

    describe('selectDataSources', () => {
      it('should return the list of data sources', () => {
        const state = {
          data: {
            sources: [
              { source_id: 'source 1' },
              { source_id: 'source 2' },
              { source_id: 'source 3' },
            ],
          },
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

    describe('selectActiveSources', () => {
      it('returns only data sources which are loaded and visible', () => {
        const state = {
          data: {
            sources: [
              { source_id: 'Source 1' },
              { source_id: 'Source 2' },
              { source_id: 'Source 3' },
            ],
            layers: {
              'Source 1': { loaded: true, visible: true },
              'source 2': { loaded: true, visible: false },
              'Source 3': { loaded: true, visible: true },
            },
          },
        };
        const expected = [state.data.sources[0], state.data.sources[2]];
        const result = selectActiveSources(state);
        expect(result).toEqual(expected);
      });

      it('returns an empty array when no layers are selected', () => {
        const state = {
          data: {
            sources: [
              { source_id: 'Source 1' },
              { source_id: 'Source 2' },
              { source_id: 'Source 3' },
            ],
            layers: {},
          },
        };
        const result = selectActiveSources(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if sources is empty', () => {
        const state = {
          data: {
            sources: [],
            layers: {},
          },
        };
        const result = selectActiveSources(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if sources is undefined', () => {
        const state = {
          data: {
            layers: {},
          },
        };
        const result = selectActiveSources(state);
        expect(result).toEqual([]);
      });

      it("returns an empty array if layers are present but sources aren't", () => {
        const state = {
          data: {
            sources: [],
            layers: {
              'Source 1': { loaded: true, visible: true },
              'Source 3': { loaded: true, visible: true },
            },
          },
        };
        const result = selectActiveSources(state);
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
                  domain: 'Domain 1',
                },
              },
              {
                metadata: {
                  domain: 'Domain 2',
                },
              },
              {
                metadata: {
                  domain: 'Domain 3',
                },
              },
            ],
          },
        };
        const expected = [
          state.data.sources[0].metadata.domain,
          state.data.sources[1].metadata.domain,
          state.data.sources[2].metadata.domain,
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
                  domain: 'Domain 1',
                },
              },
              {
                metadata: {
                  domain: 'Domain 1',
                },
              },
              {
                metadata: {
                  domain: 'Domain 2',
                },
              },
              {
                metadata: {
                  domain: 'Domain 3',
                },
              },
              {
                metadata: {
                  domain: 'Domain 3',
                },
              },
            ],
          },
        };
        const expected = ['Domain 1', 'Domain 2', 'Domain 3'];
        const notExpected = [
          'Domain 1',
          'Domain 1',
          'Domain 2',
          'Domain 3',
          'Domain 3',
        ];
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
            sources: [],
          },
        };
        const result = selectDomainList(state);
        expect(result).toEqual([]);
      });

      it('should return an empty array if no sources have a metadata property', () => {
        const state = {
          data: {
            sources: [{}, {}, {}],
          },
        };
        const result = selectDomainList(state);
        expect(result).toEqual([]);
      });

      it('should return an empty array if no sources have a domain property', () => {
        const state = {
          data: {
            sources: [{ metadata: {} }, { metadata: {} }, { metadata: {} }],
          },
        };
        const result = selectDomainList(state);
        expect(result).toEqual([]);
      });
    });
  });
});
