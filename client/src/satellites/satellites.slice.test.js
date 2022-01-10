import { waitFor } from '@testing-library/dom';
import { rest } from 'msw';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addSource } from 'data-layers/data-layers.slice';
import { server } from 'mocks/server';

import { Panels } from './satellite.constants';
import reducer, {
  fetchSatellites,
  searchSatelliteScenes,
  selectScene,
  satellitesSelector,
  scenesSelector,
  selectedSceneSelector,
  currentSearchQuerySelector,
  visualisationIdSelector,
  setHoveredScene,
  hoveredSceneSelector,
  saveImage,
  satelliteAoiSelector,
  cloudCoverPercentageSelector,
  visiblePanelSelector,
  isDrawingSatelliteAoiSelector,
  selectedSceneLayerVisibleSelector,
  setCloudCoverPercentage,
  setSelectedSceneLayerVisible,
  setVisiblePanel,
  setVisualisationId,
  startDrawingSatelliteAoi,
  endDrawingSatelliteAoi,
  onSatelliteUnmount,
} from './satellites.slice';

const mockStore = configureMockStore([thunk]);

describe('Satellites Slice', () => {
  describe('thunks', () => {
    describe('searchSatelliteScenes', () => {
      describe('pending', () => {
        /** @type {import('./satellites.slice').SatellitesState} */
        let result;

        beforeAll(() => {
          result = reducer(
            {
              requests: {},
              selectedScene: { id: 'scene-id-123' },
            },
            searchSatelliteScenes.pending('request-id-123', {
              end_date: 'end-date',
              start_date: 'start-date',
              satellites: ['sat1', 'sat2'],
            }),
          );
        });

        it('sets the request id', () => {
          expect(result.requests.searchSatelliteScenes).toBe('request-id-123');
        });

        it('sets the search query', () => {
          expect(result.currentSearchQuery).toEqual({
            end_date: 'end-date',
            start_date: 'start-date',
            satellites: ['sat1', 'sat2'],
          });
        });

        it('clears any selected scenes', () => {
          expect(result.selectedScene).toBeUndefined();
        });

        it('sets the visible panel to Results', () => {
          expect(result.visiblePanel).toBe(Panels.RESULTS);
        });
      });

      describe('fulfilled', () => {
        /** @type {import('./satellites.slice').SatellitesState} */
        let result;

        beforeAll(() => {
          result = reducer(
            {
              requests: { searchSatelliteScenes: 'request-id-123' },
            },
            {
              type: searchSatelliteScenes.fulfilled.type,
              payload: [{ id: 'scene-id-123' }, { id: 'scene-id-456' }],
            },
          );
        });

        it('Sets scenes to the response', () => {
          expect(result.scenes).toEqual([
            { id: 'scene-id-123' },
            { id: 'scene-id-456' },
          ]);
        });

        it('Clears the request id', () => {
          expect(result.requests.searchSatelliteScenes).toBeUndefined();
        });

        it('Clears any errors', () => {
          expect(result.error).toBeUndefined();
        });
      });

      describe('rejected', () => {
        /** @type {import('./satellites.slice').SatellitesState} */
        let result;

        beforeAll(() => {
          result = reducer(
            {
              requests: { searchSatelliteScenes: 'request-id-123' },
            },
            {
              type: searchSatelliteScenes.rejected.type,
              payload: { message: 'Test Error' },
            },
          );
        });

        it('Sets error to the response', () => {
          expect(result.error).toEqual({ message: 'Test Error' });
        });

        it('Clears the request id', () => {
          expect(result.requests.searchSatelliteScenes).toBeUndefined();
        });
      });
    });

    describe('saveImage', () => {
      describe('pending', () => {
        it('sets the saveImage request to the request id', () => {
          const result = reducer(
            { requests: {} },
            { type: saveImage.pending.type, meta: { requestId: 'id-123' } },
          );
          expect(result).toEqual(
            expect.objectContaining({ requests: { saveImage: 'id-123' } }),
          );
        });
      });

      describe('fulfilled', () => {
        it(`dispatches the ${saveImage.fulfilled.type} and adds the source to sources array`, async () => {
          server.use(
            rest.post(
              '*/api/satellites/datasources/:customerId/:userId/',
              (req, res, ctx) => {
                return res(
                  ctx.status(200),
                  ctx.json({ source_id: 'source-id-123' }),
                );
              },
            ),
          );

          const store = mockStore({
            accounts: {
              user: {
                id: 'user-id-123',
                customers: [{ id: 'customer-id-123' }],
              },
            },
            satellites: {
              visualisationId: 'true-color',
              selectedScene: {
                satellite: 'satellite-id-123',
                id: 'scene-id-123',
              },
            },
          });
          store.dispatch(
            saveImage({ name: 'Test name', description: 'Test description' }),
          );
          await waitFor(() =>
            expect(store.getActions()).toContainEqual(
              addSource({ source_id: 'source-id-123' }),
            ),
          );
          expect(store.getActions()).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type: saveImage.fulfilled.type,
              }),
            ]),
          );
        });

        it('Clears the saveImage request', () => {
          const result = reducer(
            { requests: { saveImage: '123' } },
            { type: saveImage.fulfilled.type },
          );
          expect(result.requests.saveImage).toBeUndefined();
        });
      });

      describe('rejected', () => {
        it(`dispatches the ${saveImage.rejected.type} action on rejected request`, async () => {
          server.use(
            rest.post(
              '*/api/satellites/datasources/:customerId/:userId/',
              (req, res, ctx) => {
                return res(ctx.status(401, 'Test Error'));
              },
            ),
          );

          const store = mockStore({
            accounts: {
              user: {
                id: 'user-id-123',
                customers: [{ id: 'customer-id-123' }],
              },
            },
            satellites: {
              visualisationId: 'true-color',
              selectedScene: {
                satellite: 'satellite-id-123',
                id: 'scene-id-123',
              },
            },
          });
          store.dispatch(
            saveImage({ name: 'Test name', description: 'Test description' }),
          );
          await waitFor(() =>
            expect(store.getActions()).toContainEqual(
              expect.objectContaining({
                type: saveImage.rejected.type,
                error: expect.anything(),
              }),
            ),
          );
        });

        it('Clears the saveImage request and sets the error', () => {
          const result = reducer(
            { requests: { saveImage: '123' } },
            {
              type: saveImage.rejected.type,
              error: { message: 'Test message' },
            },
          );
          expect(result.requests.saveImage).toBeUndefined();
          expect(result.error).toEqual({ message: 'Test message' });
        });
      });

      it("Does not request again if there's already a request pending", () => {
        const store = mockStore({
          accounts: {
            user: { id: 'user-id-123', customers: [{ id: 'customer-id-123' }] },
          },
          satellites: {
            visualisationId: 'true-color',
            selectedScene: {
              satellite: 'satellite-id-123',
              id: 'scene-id-123',
            },
            requests: {
              saveImage: true,
            },
          },
        });
        store.dispatch(
          saveImage({ name: 'Test name', description: 'Test description' }),
        );
        expect(store.getActions()).not.toContainEqual(
          expect.objectContaining({ type: saveImage.pending.type }),
        );
      });
    });
  });

  describe('Satellites Actions', () => {
    let store = null;

    beforeEach(() => {
      store = mockStore({
        accounts: { userKey: 'Test-User-Key' },
      });
    });

    it('should dispatch fetch satellites failure action.', async () => {
      server.use(
        rest.get('*/api/satellites/', (req, res, ctx) => {
          return res(ctx.status(401, 'Test Error'));
        }),
      );

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchSatellites.rejected.type,
          payload: { message: '401 Test Error' },
        }),
      ]);

      await store.dispatch(fetchSatellites());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch satellites success action.', async () => {
      const satellites = [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        },
      ];

      server.use(
        rest.get('*/api/satellites/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(satellites));
        }),
      );

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchSatellites.fulfilled.type,
          payload: satellites,
        }),
      ]);

      await store.dispatch(fetchSatellites());

      expect(store.getActions()).toEqual(expectedActions);
    });

    describe.each`
      action                          | key                            | payload
      ${setVisualisationId}           | ${'visualisationId'}           | ${'test-string'}
      ${setHoveredScene}              | ${'hoveredScene'}              | ${{ id: 1, label: 'Test' }}
      ${setCloudCoverPercentage}      | ${'cloudCoverPercentage'}      | ${50}
      ${setSelectedSceneLayerVisible} | ${'selectedSceneLayerVisible'} | ${true}
      ${setVisiblePanel}              | ${'visiblePanel'}              | ${'test-panel'}
    `('$action.type', ({ action, key, payload }) => {
      it('sets the hovered scene in state', () => {
        const result = reducer({}, action(payload));
        expect(result).toEqual(expect.objectContaining({ [key]: payload }));
      });
    });

    describe('startDrawingSatelliteAoi', () => {
      let result;

      beforeEach(() => {
        result = reducer({ aoi: [[123, 345]] }, startDrawingSatelliteAoi());
      });

      it('Sets isDrawingSatelliteAoi to true', () => {
        expect(result.isDrawingSatelliteAoi).toBe(true);
      });

      it('Clears any existing aoi', () => {
        expect(result.aoi).toBeUndefined();
      });
    });

    describe('endDrawingSatelliteAoi', () => {
      let result;

      beforeEach(() => {
        result = reducer(
          { isDrawingSatelliteAoi: true },
          endDrawingSatelliteAoi([[123, 123]]),
        );
      });

      it('Sets isDrawingSatelliteAoi to true', () => {
        expect(result.isDrawingSatelliteAoi).toBe(false);
      });

      it('Clears any existing aoi', () => {
        expect(result.aoi).toEqual([[123, 123]]);
      });
    });

    describe('selectScene', () => {
      /** @type {import('./satellites.slice').SatellitesState} */
      let result;

      beforeAll(() => {
        result = reducer(
          {
            hoveredScene: { id: 'hovered-scene-id-123' },
            selectedSceneLayerVisible: false,
            visiblePanel: Panels.RESULTS,
          },
          selectScene({ id: 'scene-id-123' }),
        );
      });

      it('sets the scene in state', () => {
        expect(result.selectedScene).toEqual({ id: 'scene-id-123' });
      });

      it('clears any hovered scene', () => {
        expect(result.hoveredScene).toBeUndefined();
      });

      it('makes the selected scene layer visible', () => {
        expect(result.selectedSceneLayerVisible).toBe(true);
      });

      it('sets the visible panel to Visualisation', () => {
        expect(result.visiblePanel).toBe(Panels.VISUALISATION);
      });
    });

    describe('onSatelliteUnmount', () => {
      let result;
      beforeAll(() => {
        result = reducer(
          { isDrawingSatelliteAoi: true, visiblePanel: Panels.SEARCH },
          onSatelliteUnmount(),
        );
      });
      it('sets isDrawingSatelliteAoi to false', () => {
        expect(result.isDrawingSatelliteAoi).toBe(false);
      });

      it('sets visiblePanel to None', () => {
        expect(result.visiblePanel).toBe(Panels.NONE);
      });
    });
  });

  describe('Satellites Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        satellites: null,
        scenes: null,
        selectedScene: null,
        error: null,
        satelliteSearches: null,
        visualisationId: 'TCI',
      };
    });

    it('should update the satellites in state, when successfully retrieved', () => {
      const satellites = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchSatellites.fulfilled.type,
        payload: satellites,
      });

      expect(actualState.satellites).toEqual(satellites);
    });

    it('should update the error state, when failed to retrieve satellites', () => {
      const error = { message: 'Test Satellites Error' };

      const actualState = reducer(beforeState, {
        type: fetchSatellites.rejected.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });
  });

  describe('selectors', () => {
    describe.each`
      selector                             | key
      ${satellitesSelector}                | ${'satellites'}
      ${scenesSelector}                    | ${'scenes'}
      ${hoveredSceneSelector}              | ${'hoveredScene'}
      ${selectedSceneSelector}             | ${'selectedScene'}
      ${currentSearchQuerySelector}        | ${'currentSearchQuery'}
      ${visualisationIdSelector}           | ${'visualisationId'}
      ${satelliteAoiSelector}              | ${'aoi'}
      ${cloudCoverPercentageSelector}      | ${'cloudCoverPercentage'}
      ${visiblePanelSelector}              | ${'visiblePanel'}
      ${isDrawingSatelliteAoiSelector}     | ${'isDrawingSatelliteAoi'}
      ${selectedSceneLayerVisibleSelector} | ${'selectedSceneLayerVisible'}
    `('$selector', ({ selector, key }) => {
      it.each`
        key             | state
        ${'state'}      | ${undefined}
        ${'satellites'} | ${{}}
        ${key}          | ${{ satellites: {} }}
      `('Returns undefined if $key is undefined', ({ state }) => {
        const result = selector(state);
        expect(result).toEqual(undefined);
      });

      it('Returns $key from state', () => {
        expect(selector({ satellites: { [key]: 'testValue' } })).toBe(
          'testValue',
        );
      });
    });
  });
});
