import { rest } from 'msw';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addLogItem } from 'app.slice';
import { server } from 'mocks/server';

import reducer, {
  fetchSources,
  selectDomainList,
  activeDataSourcesSelector,
  dashboardSourcesSelector,
  dataSourcesSelector,
  selectPollingPeriod,
  selectDataToken,
  activeLayersSelector,
  setLayers,
  categorisedOrbsAndSourcesSelector,
  activeCategorisedOrbsAndSourcesSelector,
  activeCategorisedSourcesSelector,
  logDataset,
  logError,
  updateLayers,
  addSource,
  fetchOrbs,
  orbsSelector,
  logProperty,
} from './data-layers.slice';
const mockStore = configureMockStore([thunk]);

describe('Data Slice', () => {
  describe('thunks', () => {
    let store = null;
    describe('fetchSources', () => {
      beforeEach(() => {
        store = mockStore({
          accounts: {
            user: {
              id: 'Test User ID',
              customers: [{ name: 'Test Customer Name' }],
            },
          },
          data: {
            sources: [
              {
                source_id: 'test/id/1',
                metadata: {
                  request_strategy: 'manual',
                },
              },
              {
                source_id: 'test/id/2',
                metadata: {},
              },
            ],
          },
        });
      });

      it('should dispatch fetch sources failure action.', async () => {
        server.use(
          rest.get('*/api/data/sources/', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
        );

        await store.dispatch(fetchSources());

        expect(store.getActions()).toContainEqual(
          expect.objectContaining({
            type: fetchSources.rejected.type,
            payload: { message: '401 Test Error' },
          }),
        );
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

        server.use(
          rest.get('*/api/data/sources/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(data));
          }),
        );

        await store.dispatch(fetchSources());

        expect(store.getActions()).toContainEqual(
          expect.objectContaining({
            type: fetchSources.fulfilled.type,
            payload: data,
          }),
        );
      });

      it('should dispatch logDataset action.', async () => {
        const source = {
          source_id: 'Test Dataset',
        };

        const expected = {
          content: {
            type: 'orbisUserAction',
            orbisUserAction: {
              action: 'loadLayer',
              userId: 'Test User ID',
              customerName: 'Test Customer Name',
              loadLayer: {
                dataset: source.source_id,
              },
            },
          },
          tags: ['LOAD_LAYER', source.source_id],
        };

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: addLogItem.type,
            payload: expected,
          }),
        ]);

        await store.dispatch(logDataset(source));
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch logError action.', async () => {
        const source = {
          source_id: 'Test Dataset',
        };

        const expected = {
          content: {
            type: 'orbisClientError',
            orbisClientError: {
              error: 'loadLayerError',
              userId: 'Test User ID',
              customerName: 'Test Customer Name',
              loadLayerError: {
                dataset: source.source_id,
              },
            },
          },
          tags: ['LOAD_LAYER_ERROR', source.source_id],
        };

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: addLogItem.type,
            payload: expected,
          }),
        ]);

        await store.dispatch(logError(source));
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch setLayers action to update the layer loaded and log it.', async () => {
        const layers = ['test/id/1', 'test/id/2'];

        const expected = {
          content: {
            type: 'orbisUserAction',
            orbisUserAction: {
              action: 'loadLayer',
              userId: 'Test User ID',
              customerName: 'Test Customer Name',
              loadLayer: {
                dataset: layers[1],
              },
            },
          },
          tags: ['LOAD_LAYER', layers[1]],
        };

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({ type: addLogItem.type, payload: expected }),
          expect.objectContaining({ type: updateLayers.type, payload: layers }),
        ]);

        await store.dispatch(setLayers(layers));
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('fetchOrbs', () => {
      beforeEach(() => {
        store = mockStore({ data: {} });
      });

      it(`Dispatches the ${fetchOrbs.rejected.type} action on failed request`, async () => {
        server.use(
          rest.get('*/api/orbs/', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
        );
        await store.dispatch(fetchOrbs());
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: fetchOrbs.rejected.type,
              payload: { message: '401 Test Error' },
            }),
          ]),
        );
      });

      it(`Dispatches the ${fetchOrbs.fulfilled.type} action on a successful request`, async () => {
        const orbs = [{ id: 1 }, { id: 2 }];
        server.use(
          rest.get('*/api/orbs/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(orbs));
          }),
        );
        await store.dispatch(fetchOrbs());
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: fetchOrbs.fulfilled.type,
              payload: orbs,
            }),
          ]),
        );
      });

      describe('pending', () => {
        it('Sets loading status', () => {
          const result = reducer({}, { type: fetchOrbs.pending.type });
          expect(result).toEqual({
            requests: { fetchOrbs: 'pending' },
          });
        });
      });

      describe('fulfilled', () => {
        it('sets orbs in state', () => {
          const orbs = [{ id: 1 }, { id: 2 }];
          const result = reducer(
            {},
            { type: fetchOrbs.fulfilled.type, payload: orbs },
          );
          expect(result).toEqual(expect.objectContaining({ orbs }));
        });
      });

      describe('rejected', () => {
        it('sets the error in state', () => {
          const payload = { message: 'Failed' };
          const result = reducer(
            {},
            { type: fetchOrbs.rejected.type, payload },
          );
          expect(result).toEqual(expect.objectContaining({ error: payload }));
        });
      });
    });

    describe('setLayers', () => {
      beforeEach(() => {
        store = mockStore({
          accounts: {
            user: {
              id: 'Test User ID',
              customers: [{ name: 'Test Customer Name' }],
            },
          },
          data: {
            layers: ['test/id/1', 'test/id/2'],
            sources: [
              {
                source_id: 'test/id/1',
                metadata: {
                  request_strategy: 'manual',
                },
              },
              {
                source_id: 'test/id/2',
                metadata: {},
              },
            ],
          },
        });
      });

      it(`Dispatches the ${setLayers.rejected.type} action on failed request`, async () => {
        server.use(
          rest.post('*/api/broken/link', (req, res, ctx) => {
            return res(ctx.status(401));
          }),
        );
        const layers = [
          { sourceId: 'foo/bar/baz/1' },
          { sourceId: 'foo/bar/baz/2' },
        ];
        await store.dispatch(setLayers(layers));
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: setLayers.rejected.type,
            }),
          ]),
        );
      });

      it(`Dispatches the ${setLayers.fulfilled.type} action on a successful request`, async () => {
        const layers = [{ source_id: 'test/id/1' }, { source_id: 'test/id/2' }];
        server.use(
          rest.get('*/api/setLayers', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(layers));
          }),
        );
        await store.dispatch(setLayers(layers));
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: setLayers.fulfilled.type,
            }),
          ]),
        );
      });
    });

    describe('logproperty', () => {
      beforeEach(() => {
        store = mockStore({
          accounts: {
            user: {
              id: 'Test User ID',
              customers: [{ name: 'Test Customer Name' }],
            },
          },
        });
      });

      it(`Dispatches the ${logProperty.rejected.type} action on failed request`, async () => {
        const payload = {};
        await store.dispatch(logProperty(payload));
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: logProperty.rejected.type,
            }),
          ]),
        );
      });

      it(`Dispatches the ${logProperty.fulfilled.type} action on successful request`, async () => {
        const payload = {
          source: 'foo/bar/baz',
          property: 'some_property',
          isOn: true,
        };
        await store.dispatch(logProperty(payload));
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: logProperty.fulfilled.type,
            }),
          ]),
        );
      });
    });

    describe('logDataset', () => {
      beforeEach(() => {
        store = mockStore({
          accounts: {
            user: {
              id: 'Test User ID',
              customers: [{ name: 'Test Customer Name' }],
            },
          },
        });
      });

      it(`Dispatches the ${logDataset.rejected.type} action on failed request`, async () => {
        await store.dispatch(logDataset(undefined));
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: logProperty.rejected.type,
            }),
          ]),
        );
      });

      it(`Dispatches the ${logDataset.rejected.type} action on successful request`, async () => {
        const payload = {
          source: 'foo/bar/baz',
        };
        await store.dispatch(logDataset(payload));
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: logProperty.fulfilled.type,
            }),
          ]),
        );
      });
    });

    describe('logError', () => {
      beforeEach(() => {
        store = mockStore({
          accounts: {
            user: {
              id: 'Test User ID',
              customers: [{ name: 'Test Customer Name' }],
            },
          },
        });
      });

      it(`Dispatches the ${logError.rejected.type} action on failed request`, async () => {
        await store.dispatch(logError(undefined));
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: logError.rejected.type,
            }),
          ]),
        );
      });

      it(`Dispatches the ${logError.fulfilled.type} action on successful request`, async () => {
        const payload = {
          source: 'foo/bar/baz',
        };
        await store.dispatch(logError(payload));
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: logError.fulfilled.type,
            }),
          ]),
        );
      });
    });
  });

  describe('reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        layers: [],
        sources: null,
        tokens: null,
        pollingPeriod: 30000,
        error: null,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(expect.objectContaining(beforeState));
    });

    describe('updateLayers', () => {
      it("sets the layers in state if it doesn't exist", () => {
        const state = {};
        const layers = ['test/id/1', 'test/id/2'];
        const result = reducer(state, updateLayers(layers));
        expect(result.layers).toEqual(layers);
      });

      it('replaces the layers array in state', () => {
        const state = {
          layers: ['test/id/1', 'test/id/2'],
        };
        const layers = ['test/id/3', 'test/id/4'];
        const result = reducer(state, updateLayers(layers));
        expect(result.layers).toEqual(layers);
      });

      it('works if the payload is an array of objects', () => {
        const state = { layers: ['test/id/1', 'test/id/2'] };
        const layers = [{ source_id: 'test/id/3' }, { source_id: 'test/id/4' }];
        const expected = ['test/id/3', 'test/id/4'];
        const result = reducer(state, updateLayers(layers));

        expect(result.layers).toEqual(expected);
      });

      it('does nothing if the object array does not contain `source_id` properties', () => {
        const state = { layers: ['test/id/1', 'test/id/2'] };
        const layers = [{ id: 'test/id/3' }, { id: 'test/id/4' }];
        const result = reducer(state, setLayers(layers));
        expect(result.layers).toEqual(state.layers);
      });

      it('does nothing if the payload is undefined', () => {
        const state = { layers: ['test/id/1', 'test/id/2'] };
        const result = reducer(state, updateLayers(undefined));
        expect(result.layers).toEqual(state.layers);
      });

      it('removes all layers if set to an empty array', () => {
        const state = { layers: ['test/id/1', 'test/id/2'] };
        const result = reducer(state, updateLayers([]));
        expect(result.layers).toEqual([]);
      });
    });

    describe('fetchSourcesSuccess', () => {
      it('should update the sources in state, when successfully retrieved', () => {
        const data = {
          tokens: {
            'test/layer': 'testAuthToken',
            'test/layer2': 'testAuthToken2',
          },
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
          type: fetchSources.fulfilled.type,
          payload: data,
        });

        expect(actualState.tokens).toEqual(data.tokens);
        expect(actualState.pollingPeriod).toEqual(timeoutInMilliseconds);
        expect(actualState.sources).toEqual(data.sources);
      });
    });

    describe('fetchSourcesFailure', () => {
      it('should update the error state, when failed to retrieve sources', () => {
        const error = { message: 'Test Bookmarks Error' };

        const actualState = reducer(beforeState, {
          type: fetchSources.rejected.type,
          payload: error,
        });

        expect(actualState.error).toEqual(error);
      });
    });

    describe('addSource', () => {
      it('adds a source to the sources array', () => {
        const state = { sources: [{ source_id: 'source-id-123' }] };
        const result = reducer(
          state,
          addSource({ source_id: 'source-id-456' }),
        );
        expect(result).toEqual(
          expect.objectContaining({
            sources: [
              { source_id: 'source-id-123' },
              { source_id: 'source-id-456' },
            ],
          }),
        );
      });
    });
  });

  describe('selectors', () => {
    describe('selectDataToken', () => {
      it('should return the data token from state', () => {
        const state = {
          data: {
            tokens: {
              'test/layer': 'testAuthToken',
              'test/layer2': 'testAuthToken2',
            },
          },
        };
        const result = selectDataToken(state);
        expect(result).toBe(state.data.tokens);
      });

      it('should return null if no data state is present', () => {
        const state = {};
        const result = selectDataToken(state);
        expect(result).toBeNull();
      });

      it('should return null if no token is present', () => {
        const state = {
          data: {},
        };
        const result = selectDataToken(state);
        expect(result).toBeNull();
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

    describe('dashBoardSourcesSelector', () => {
      it('should return the list of data sources', () => {
        const sourceWithDashboard = {
            metadata: {
              application: {
                orbis: {
                  dashboard_component: {
                    name: 'dashboard 1',
                  },
                },
              },
            },
          },
          state = {
            data: {
              sources: [
                { metadata: {} },
                { metadata: {} },
                sourceWithDashboard,
              ],
            },
          };
        const result = dashboardSourcesSelector(state);
        expect(result).toEqual([sourceWithDashboard]);
      });
      it('should return an empty array if no data state is present', () => {
        const state = {
          data: {
            sources: [{ metadata: {} }, { metadata: {} }, { metadata: {} }],
          },
        };
        const result = dashboardSourcesSelector(state);
        expect(result).toEqual([]);
      });
      it('should return an empty array if no sources are present', () => {
        const state = { data: { sources: null } };
        const result = dashboardSourcesSelector(state);
        expect(result).toEqual([]);
      });
    });

    describe('dataSourcesSelector', () => {
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
        const result = dataSourcesSelector(state);
        expect(result).toEqual(state.data.sources);
      });

      it('should return an empty array if no data state is present', () => {
        const state = {};
        const result = dataSourcesSelector(state);
        expect(result).toEqual([]);
      });

      it('should return an empty array if no sources are present', () => {
        const state = { data: {} };
        const result = dataSourcesSelector(state);
        expect(result).toEqual([]);
      });
    });

    describe('orbsSelector', () => {
      it('Returns undefined if state is undefined', () => {
        expect(orbsSelector({})).toBeUndefined();
      });

      it('Returns undefined if orbs is undefined', () => {
        const state = { data: {} };
        expect(orbsSelector(state)).toBeUndefined();
      });

      it('Returns orbs from state', () => {
        const state = { data: { orbs: 'test-value' } };
        expect(orbsSelector(state)).toBe('test-value');
      });
    });

    describe('activeLayersSelector', () => {
      it('returns an empty object if state is undefined', () => {
        const result = activeLayersSelector();
        expect(result).toEqual([]);
      });

      it('returns an empty object if data is undefined', () => {
        const result = activeLayersSelector({});
        expect(result).toEqual([]);
      });

      it('returns an empty object if layers is undefined', () => {
        const result = activeLayersSelector({ data: {} });
        expect(result).toEqual([]);
      });

      it('returns layers', () => {
        const state = {
          data: {
            layers: ['test/layer/1'],
          },
        };
        const result = activeLayersSelector(state);
        expect(result).toEqual(state.data.layers);
      });
    });

    describe('activeDataSourcesSelector', () => {
      it('returns only data sources which are loaded and visible', () => {
        const state = {
          data: {
            sources: [
              { source_id: 'Source 1' },
              { source_id: 'Source 2' },
              { source_id: 'Source 3' },
            ],
            layers: ['Source 1', 'source 2', 'Source 3'],
          },
        };
        const expected = [state.data.sources[0], state.data.sources[2]];
        const result = activeDataSourcesSelector(state);
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
            layers: [],
          },
        };
        const result = activeDataSourcesSelector(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if sources is empty', () => {
        const state = {
          data: {
            sources: [],
            layers: [],
          },
        };
        const result = activeDataSourcesSelector(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if sources is undefined', () => {
        const state = {
          data: {
            layers: [],
          },
        };
        const result = activeDataSourcesSelector(state);
        expect(result).toEqual([]);
      });

      it("returns an empty array if layers are present but sources aren't", () => {
        const state = {
          data: {
            sources: [],
            layers: ['Source 1', 'Source 3'],
          },
        };
        const result = activeDataSourcesSelector(state);
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

    describe('categorised selectors', () => {
      const sources = [
        {
          source_id: 'orb/1/cat/1/source/1',
          metadata: {
            application: {
              orbis: {
                orbs: [{ name: 'Orb1' }],
                categories: { name: 'Cat1' },
              },
            },
          },
        },
        {
          source_id: 'orb/2/cat/1/source/1',
          metadata: {
            application: {
              orbis: {
                orbs: [{ name: 'Orb2' }],
                categories: { name: 'Cat1' },
              },
            },
          },
        },
      ];
      describe('categorisedOrbsAndSourcesSelector', () => {
        it('returns all sources organised by orb and category', () => {
          const state = {
            data: {
              sources,
            },
          };
          const expected = [
            {
              name: 'Orb1',
              sources: [
                {
                  category: 'Cat1',
                  sources: [
                    expect.objectContaining({
                      source_id: 'orb/1/cat/1/source/1',
                    }),
                  ],
                },
              ],
            },
            {
              name: 'Orb2',
              sources: [
                {
                  category: 'Cat1',
                  sources: [
                    expect.objectContaining({
                      source_id: 'orb/2/cat/1/source/1',
                    }),
                  ],
                },
              ],
            },
          ];

          const result = categorisedOrbsAndSourcesSelector()(state);
          expect(result).toEqual(expected);
        });
      });

      describe('activeCategorisedOrbsAndSourcesSelector', () => {
        it('returns sources organised by orb and category if active', () => {
          const state = {
            data: {
              layers: ['orb/1/cat/1/source/1'],
              sources,
            },
          };
          const expected = [
            {
              name: 'Orb1',
              sources: [
                {
                  category: 'Cat1',
                  sources: [
                    expect.objectContaining({
                      source_id: 'orb/1/cat/1/source/1',
                    }),
                  ],
                },
              ],
            },
          ];

          const result = activeCategorisedOrbsAndSourcesSelector()(state);
          expect(result).toEqual(expected);
        });
      });

      describe('activeCategorisedSourcesSelector', () => {
        it('returns only active categories and sources', () => {
          const state = {
            data: {
              layers: ['orb/1/cat/1/source/1'],
              sources,
            },
          };
          const expected = [
            {
              category: 'Cat1',
              sources: [
                expect.objectContaining({
                  source_id: 'orb/1/cat/1/source/1',
                }),
              ],
            },
          ];

          const result = activeCategorisedSourcesSelector()(state);
          expect(result).toEqual(expected);
        });
      });
    });
  });
});
