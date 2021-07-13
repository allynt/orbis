import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  fetchSatellitesSuccess,
  fetchSatellitesFailure,
  fetchSatellites,
  fetchSatelliteScenesSuccess,
  fetchSatelliteScenesFailure,
  fetchSatelliteScenes,
  selectScene,
  removeScenes,
  fetchPinnedScenesSuccess,
  fetchPinnedScenesFailure,
  fetchPinnedScenes,
  pinSceneSuccess,
  pinSceneFailure,
  pinScene,
  deletePinnedSceneSuccess,
  deletePinnedSceneFailure,
  deletePinnedScene,
  selectPinnedScene,
  deselectPinnedScene,
  clearSelectedPinnedScenes,
  setCurrentSatelliteSearchQuery,
  selectedPinnedScenesSelector,
  satellitesSelector,
  scenesSelector,
  selectedSceneSelector,
  pinnedScenesSelector,
  currentSearchQuerySelector,
  visualisationIdSelector,
  savedSearchesSelector,
} from './satellites.slice';

const mockStore = configureMockStore([thunk]);

describe('Satellites Slice', () => {
  describe('Satellites Actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

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

      const expectedActions = [
        {
          type: fetchSatellitesFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

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

      const expectedActions = [
        { type: fetchSatellitesSuccess.type, payload: satellites },
      ];

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

      const expectedActions = [
        { type: removeScenes.type },
        {
          type: fetchSatelliteScenesFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

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

      const expectedActions = [
        { type: removeScenes.type },
        { type: fetchSatelliteScenesSuccess.type, payload: scenes },
      ];

      await store.dispatch(fetchSatelliteScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch pinned scenes failure action.', async () => {
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
          type: fetchPinnedScenesFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

      await store.dispatch(fetchPinnedScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch pinned scenes success action.', async () => {
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

      const expectedActions = [
        { type: fetchPinnedScenesSuccess.type, payload: scenes },
      ];

      await store.dispatch(fetchPinnedScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch pin scene failure action.', async () => {
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
        { type: pinSceneFailure.type, payload: { message: '401 Test Error' } },
      ];

      const form = {};
      await store.dispatch(pinScene(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch pin scene success action.', async () => {
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

      const expectedActions = [{ type: pinSceneSuccess.type, payload: scenes }];

      const form = {};
      await store.dispatch(pinScene(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete pinned scene failure action.', async () => {
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
          type: deletePinnedSceneFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

      const form = {};
      await store.dispatch(deletePinnedScene(1));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete pinned scene success action.', async () => {
      const scene = {
        id: 1,
      };

      fetch.mockResponse(JSON.stringify(scene));

      const expectedActions = [
        { type: deletePinnedSceneSuccess.type, payload: scene.id },
      ];

      await store.dispatch(deletePinnedScene(scene.id));

      expect(store.getActions()).toEqual(expectedActions);
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
        pinnedScenes: null,
        selectedPinnedScenes: [],
        visualisationId: 'TCI',
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the satellites in state, when successfully retrieved', () => {
      const satellites = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchSatellitesSuccess.type,
        payload: satellites,
      });

      expect(actualState.satellites).toEqual(satellites);
    });

    it('should update the error state, when failed to retrieve satellites', () => {
      const error = { message: 'Test Satellites Error' };

      const actualState = reducer(beforeState, {
        type: fetchSatellitesFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the satellites scenes in state, when successfully retrieved', () => {
      const satellitesScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchSatelliteScenesSuccess.type,
        payload: satellitesScenes,
      });

      expect(actualState.scenes).toEqual(satellitesScenes);
    });

    it('should update the error state, when failed to retrieve satellites scenes', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: fetchSatelliteScenesFailure.type,
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
      const actualState = reducer(beforeState, {
        type: removeScenes.type,
      });

      expect(actualState.selectedScene).toEqual(null);
    });

    it('should update the pinned satellite scenes in state, when successfully retrieved', () => {
      const pinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchPinnedScenesSuccess.type,
        payload: pinnedScenes,
      });

      expect(actualState.pinnedScenes).toEqual(pinnedScenes);
    });

    it('should update the error state, when failed to fetch pinned scenes', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: fetchPinnedScenesFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the pinned satellite scenes in state, when successfully pinned scene', () => {
      beforeState.pinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const sceneToPin = { id: 5 };

      const actualState = reducer(beforeState, {
        type: pinSceneSuccess.type,
        payload: sceneToPin,
      });

      expect(actualState.pinnedScenes).toEqual([
        ...beforeState.pinnedScenes,
        sceneToPin,
      ]);
    });

    it('should update the error state, when failed to pin a new scene', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: pinSceneFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the pinned satellite scenes in state, when successfully deleted a pinned scene', () => {
      beforeState.pinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const pinnedSceneToDelete = beforeState.pinnedScenes[1];

      const actualState = reducer(beforeState, {
        type: deletePinnedSceneSuccess.type,
        payload: pinnedSceneToDelete.id,
      });

      expect(actualState.pinnedScenes).toEqual(
        beforeState.pinnedScenes.filter(
          scene => scene.id !== pinnedSceneToDelete.id,
        ),
      );
    });

    it('should update the error state, when failed to delete a pinned scene', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: deletePinnedSceneFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the selected pinned satellite scenes in state, when a pinned scene selected, when none exist', () => {
      const selectedScene = { id: 1 };

      const actualState = reducer(beforeState, {
        type: selectPinnedScene.type,
        payload: selectedScene,
      });

      expect(actualState.selectedPinnedScenes).toEqual([selectedScene]);
    });

    it('should update the selected pinned satellite scenes in state, when a pinned scene selected, when some already exist', () => {
      beforeState.selectedPinnedScenes = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ];
      const selectedScene = { id: 5 };

      const actualState = reducer(beforeState, {
        type: selectPinnedScene.type,
        payload: selectedScene,
      });

      expect(actualState.selectedPinnedScenes).toEqual([
        ...beforeState.selectedPinnedScenes,
        selectedScene,
      ]);
    });

    it('should update the selected pinned satellite scenes in state, when an existing pinned scene is deselected', () => {
      beforeState.selectedPinnedScenes = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ];
      const sceneToDelete = { id: 2 };

      const actualState = reducer(beforeState, {
        type: deselectPinnedScene.type,
        payload: sceneToDelete,
      });

      expect(actualState.selectedPinnedScenes).toEqual([
        ...beforeState.selectedPinnedScenes.filter(
          scene => scene.id !== sceneToDelete.id,
        ),
      ]);
    });

    it("'should not update the selected pinned satellite scenes in state, when scene to deselected, doesn't exist", () => {
      beforeState.selectedPinnedScenes = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ];
      const sceneToDelete = { id: 5 };

      const actualState = reducer(beforeState, {
        type: deselectPinnedScene.type,
        payload: sceneToDelete,
      });

      expect(actualState.selectedPinnedScenes).toEqual([
        ...beforeState.selectedPinnedScenes.filter(
          scene => scene.id !== sceneToDelete.id,
        ),
      ]);
    });

    it('should update the selected pinned satellite scenes in state, when scenes to be cleared', () => {
      beforeState.selectedPinnedScenes = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ];

      const actualState = reducer(beforeState, {
        type: clearSelectedPinnedScenes.type,
      });

      expect(actualState.selectedPinnedScenes).toEqual([]);
    });

    it('should update the current satellite search query in state', () => {
      const query = {
        id: 1,
      };

      const actualState = reducer(beforeState, {
        type: setCurrentSatelliteSearchQuery.type,
        payload: query,
      });

      expect(actualState.currentSearchQuery).toEqual(query);
    });
  });

  describe('selectors', () => {
    describe('selectedPinnedScenesSelector', () => {
      it('returns an empty array if state is undefined', () => {
        const result = selectedPinnedScenesSelector();
        expect(result).toEqual([]);
      });

      it('returns an empty array if satellites is undefined', () => {
        const state = {};
        const result = selectedPinnedScenesSelector(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if selectedPinnedScenes is undefined', () => {
        const state = { satellites: {} };
        const result = selectedPinnedScenesSelector(state);
        expect(result).toEqual([]);
      });

      it('returns selectedPinnedScenes', () => {
        const state = {
          satellites: {
            selectedPinnedScenes: [{ test: 'val1' }, { test: 'val2' }],
          },
        };
        const result = selectedPinnedScenesSelector(state);
        expect(result).toEqual(state.satellites.selectedPinnedScenes);
      });
    });

    describe.each`
      selector                      | key
      ${satellitesSelector}         | ${'satellites'}
      ${scenesSelector}             | ${'scenes'}
      ${selectedSceneSelector}      | ${'selectedScene'}
      ${pinnedScenesSelector}       | ${'pinnedScenes'}
      ${currentSearchQuerySelector} | ${'currentSearchQuery'}
      ${visualisationIdSelector}    | ${'visualisationId'}
      ${savedSearchesSelector}      | ${'satelliteSearches'}
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
