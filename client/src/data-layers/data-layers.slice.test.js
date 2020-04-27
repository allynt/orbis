import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer, {
  addLayers,
  removeLayer,
  fetchSourcesFailure,
  fetchSourcesSuccess,
  fetchSources,
  selectDomainList,
  selectUserLayers,
  selectDataSources,
  selectPollingPeriod,
  selectDataToken,
  selectAvailableFilters,
} from './data-layers.slice';

const mockStore = configureMockStore([thunk]);

describe('Data Slice', () => {
  describe('actions', () => {
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

        const expectedActions = [{ type: fetchSourcesSuccess.type, payload: data }];

        await store.dispatch(fetchSources());

        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        layers: [],
        sources: null,
        token: null,
        pollingPeriod: 30000,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the data layers in state, when none previously selected', () => {
      const layers = ['Test Layer 1', 'Test Layer 2'];

      const actualState = reducer(beforeState, {
        type: addLayers.type,
        payload: layers,
      });

      expect(actualState.layers).toEqual(layers);
    });

    it('should set the data layers as strings when the function receives objects', () => {
      const layers = ['Test Layer 1', 'Test Layer 2'];
      const objects = layers.map(layer => ({ name: layer }));
      const actualState = reducer(beforeState, addLayers(objects));
      expect(actualState.layers).toEqual(layers);
    });

    it('should update the data layers in state, when layers previously selected', () => {
      beforeState.layers = ['Test Layer 1', 'Test Layer 2'];
      const layers = ['Test Layer 3', 'Test Layer 4'];

      const actualState = reducer(beforeState, {
        type: addLayers.type,
        payload: layers,
      });

      expect(actualState.layers).toEqual([...beforeState.layers, ...layers]);
    });

    it('should update the data layers in state, when layers previously selected is removed', () => {
      beforeState.layers = ['Test Layer 1', 'Test Layer 2'];
      const layer = 'Test Layer 1';

      const actualState = reducer(beforeState, {
        type: removeLayer.type,
        payload: layer,
      });

      expect(actualState.layers).toEqual([beforeState.layers[1]]);
    });

    it("should not update the data layers in state, when layer selected doesn't exist", () => {
      beforeState.layers = ['Test Layer 1', 'Test Layer 2'];
      const layer = 'Test Layer 3';

      const actualState = reducer(beforeState, {
        type: removeLayer.type,
        payload: layer,
      });

      expect(actualState.layers).toEqual(beforeState.layers);
    });

    it('should remove layers when an object is received', () => {
      beforeState.layers = ['Test Layer 1', 'Test Layer 2'];
      const expected = [beforeState.layers[0]];
      const layer = { name: beforeState.layers[1] };
      const actualState = reducer(beforeState, removeLayer(layer));
      expect(actualState.layers).toEqual(expected);
    });

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

    it('should update the error state, when failed to retrieve sources', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: fetchSourcesFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
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
            sources: [{ name: 'source 1' }, { name: 'source 2' }, { name: 'source 3' }],
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

    describe('selectUserLayers', () => {
      it('returns only data sources which are selected', () => {
        const state = {
          data: {
            sources: [{ name: 'Source 1' }, { name: 'Source 2' }, { name: 'Source 3' }],
            layers: ['Source 1', 'Source 3'],
          },
        };
        const expected = [state.data.sources[0], state.data.sources[2]];
        const result = selectUserLayers(state);
        expect(result).toEqual(expected);
      });

      it('returns an empty array when no layers are selected', () => {
        const state = {
          data: {
            sources: [{ name: 'Source 1' }, { name: 'Source 2' }, { name: 'Source 3' }],
            layers: [],
          },
        };
        const result = selectUserLayers(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if sources is empty', () => {
        const state = {
          data: {
            sources: [],
            layers: [],
          },
        };
        const result = selectUserLayers(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if sources is undefined', () => {
        const state = {
          data: {
            layers: [],
          },
        };
        const result = selectUserLayers(state);
        expect(result).toEqual([]);
      });

      it("returns an empty array if layers are present but sources aren't", () => {
        const state = {
          data: {
            sources: [],
            layers: ['Source 1', 'Source 3'],
          },
        };
        const result = selectUserLayers(state);
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

    describe('selectAvailableFilters', () => {
      it('should return the filters with options based on the current user selected layers', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                name: 'fruit-bowl',
                metadata: {
                  filters: ['fruit'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('should only return unique options', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                name: 'fruit-bowl',
                metadata: {
                  filters: ['fruit'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('should return filter sections for each selected layer', () => {
        const state = {
          data: {
            layers: ['fruit-bowl', 'cars'],
            sources: [
              {
                name: 'fruit-bowl',
                metadata: {
                  filters: ['fruit'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
              {
                name: 'cars',
                metadata: {
                  filters: ['model'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        model: 'BMW',
                      },
                    },
                    {
                      properties: {
                        model: 'Porsche',
                      },
                    },
                    {
                      properties: {
                        model: 'Lada',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          cars: {
            model: ['BMW', 'Porsche', 'Lada'],
          },
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('should return options for each filterable property', () => {
        const state = {
          data: {
            layers: ['cars'],
            sources: [
              {
                name: 'cars',
                metadata: {
                  filters: ['model', 'engine'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        model: 'BMW',
                        engine: 'Straight 6',
                      },
                    },
                    {
                      properties: {
                        model: 'Porsche',
                        engine: 'Flat 4',
                      },
                    },
                    {
                      properties: {
                        model: 'Lada',
                        engine: 'Hamster',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          cars: {
            model: ['BMW', 'Porsche', 'Lada'],
            engine: ['Straight 6', 'Flat 4', 'Hamster'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('should return an empty object if the user has not selected layers', () => {
        const state = {
          data: {
            layers: [],
            sources: [
              {
                name: 'fruit-bowl',
                metadata: {
                  filters: ['fruit'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual({});
      });

      it('should return an empty object if there are no sources available', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual({});
      });

      it('should return an empty object if there are sources but non are filterable', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                name: 'fruit-bowl',
                metadata: {},
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual({});
      });

      it('should not include a filter if it is specified but does not match to a property', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                name: 'fruit-bowl',
                metadata: {
                  filters: ['fruit', 'status'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('should not fail if a feature does not contain the filterable property', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                name: 'fruit-bowl',
                metadata: {
                  filters: ['fruit', 'status'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                        status: 'fresh',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                        status: 'rotten',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
            status: ['fresh', 'rotten'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });
    });
  });
});
