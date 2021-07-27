import { waitFor } from '@testing-library/dom';
import fetch from 'jest-fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addSource } from 'data-layers/data-layers.slice';

import reducer, {
  fetchSatellites,
  fetchSatelliteScenes,
  selectScene,
  satellitesSelector,
  scenesSelector,
  selectedSceneSelector,
  currentSearchQuerySelector,
  visualisationIdSelector,
  setHoveredScene,
  hoveredSceneSelector,
  saveImage,
  aoiSelector,
  cloudCoverPercentageSelector,
  visiblePanelSelector,
  isDrawingAoiSelector,
  selectedSceneLayerVisibleSelector,
  setIsDrawingAoi,
  setCloudCoverPercentage,
  setSelectedSceneLayerVisible,
  setVisiblePanel,
  setVisualisationId,
  setAoi,
} from './satellites.slice';

const mockStore = configureMockStore([thunk]);

describe('Satellites Slice', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('thunks', () => {
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
          fetch.once(JSON.stringify({ source_id: 'source-id-123' }));
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
          fetch.once(
            JSON.stringify({
              message: 'Test error message',
            }),
            {
              ok: false,
              status: 401,
              statusText: 'Test Error',
            },
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
      fetch.mockResponse(JSON.stringify(satellites));

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchSatellites.fulfilled.type,
          payload: satellites,
        }),
      ]);

      await store.dispatch(fetchSatellites());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch satellites scenes failure action.', async () => {
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

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({ type: fetchSatelliteScenes.pending.type }),
        expect.objectContaining({
          type: fetchSatelliteScenes.rejected.type,
          payload: { message: '401 Test Error' },
        }),
      ]);

      await store.dispatch(fetchSatelliteScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch satellites scenes success action.', async () => {
      const scenes = [
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
      fetch.mockResponse(JSON.stringify(scenes));

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({ type: fetchSatelliteScenes.pending.type }),
        expect.objectContaining({
          type: fetchSatelliteScenes.fulfilled.type,
          payload: scenes,
        }),
      ]);

      await store.dispatch(fetchSatelliteScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    describe.each`
      action                          | key                            | payload
      ${setVisualisationId}           | ${'visualisationId'}           | ${'test-string'}
      ${setHoveredScene}              | ${'hoveredScene'}              | ${{ id: 1, label: 'Test' }}
      ${setIsDrawingAoi}              | ${'isDrawingAoi'}              | ${true}
      ${setCloudCoverPercentage}      | ${'cloudCoverPercentage'}      | ${50}
      ${setSelectedSceneLayerVisible} | ${'selectedSceneLayerVisible'} | ${true}
      ${setVisiblePanel}              | ${'visiblePanel'}              | ${'test-panel'}
      ${setAoi} | ${'aoi'} | ${[
  [1, 2],
  [3, 5],
]}
    `('$action.type', ({ action, key, payload }) => {
      it('sets the hovered scene in state', () => {
        const result = reducer({}, action(payload));
        expect(result).toEqual(expect.objectContaining({ [key]: payload }));
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

    it('should update the satellites scenes in state, when successfully retrieved', () => {
      const satellitesScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchSatelliteScenes.fulfilled.type,
        payload: satellitesScenes,
      });

      expect(actualState.scenes).toEqual(satellitesScenes);
    });

    it('should update the error state, when failed to retrieve satellites scenes', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: fetchSatelliteScenes.rejected.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the selected scene in state, when one selected', () => {
      const scene = { id: 1 };

      const actualState = reducer(beforeState, {
        type: selectScene.type,
        payload: scene,
      });

      expect(actualState.selectedScene).toEqual(scene);
    });

    it('should update the selected scenes in state, when they are cleared', () => {
      const actualState = reducer(
        beforeState,
        fetchSatelliteScenes.pending({}),
      );

      expect(actualState.selectedScene).toEqual(null);
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
      ${aoiSelector}                       | ${'aoi'}
      ${cloudCoverPercentageSelector}      | ${'cloudCoverPercentage'}
      ${visiblePanelSelector}              | ${'visiblePanel'}
      ${isDrawingAoiSelector}              | ${'isDrawingAoi'}
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
