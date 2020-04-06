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
  fetchSatellitesSearchesSuccess,
  fetchSatellitesSearchesFailure,
  fetchSavedSatelliteSearches,
  saveSatelliteSearchSuccess,
  saveSatelliteSearchFailure,
  saveSatelliteSearch,
  deleteSatelliteSearchSuccess,
  deleteSatelliteSearchFailure,
  deleteSavedSatelliteSearch,
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
  setCurrentSatelliteSearchQuery
} from './satellites.slice';

const mockStore = configureMockStore([thunk]);

describe('Satellites Slice', () => {
  describe('Satellites Actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: { userKey: 'Test-User-Key' }
      });
    });

    it('should dispatch fetch satellites failure action.', async () => {
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

      const expectedActions = [{ type: fetchSatellitesFailure.type, payload: { message: '401 Test Error' } }];

      await store.dispatch(fetchSatellites());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch satellites success action.', async () => {
      const satellites = [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        }
      ];
      fetch.mockResponse(JSON.stringify(satellites));

      const expectedActions = [{ type: fetchSatellitesSuccess.type, payload: satellites }];

      await store.dispatch(fetchSatellites());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch satellites scenes failure action.', async () => {
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

      const expectedActions = [
        { type: removeScenes.type },
        { type: fetchSatelliteScenesFailure.type, payload: { message: '401 Test Error' } }
      ];

      await store.dispatch(fetchSatelliteScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch satellites scenes success action.', async () => {
      const scenes = [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        }
      ];
      fetch.mockResponse(JSON.stringify(scenes));

      const expectedActions = [
        { type: removeScenes.type },
        { type: fetchSatelliteScenesSuccess.type, payload: scenes }
      ];

      await store.dispatch(fetchSatelliteScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch saved satellite searches failure action.', async () => {
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

      const expectedActions = [{ type: fetchSatellitesSearchesFailure.type, payload: { message: '401 Test Error' } }];

      await store.dispatch(fetchSavedSatelliteSearches());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch saved satellite searches success action.', async () => {
      const searches = [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        }
      ];
      fetch.mockResponse(JSON.stringify(searches));

      const expectedActions = [{ type: fetchSatellitesSearchesSuccess.type, payload: searches }];

      await store.dispatch(fetchSavedSatelliteSearches());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete saved satellite search failure action.', async () => {
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

      const expectedActions = [{ type: deleteSatelliteSearchFailure.type, payload: { message: '401 Test Error' } }];

      await store.dispatch(deleteSavedSatelliteSearch(1));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete saved satellite search success action.', async () => {
      const search = {
        id: 1
      };
      fetch.mockResponse(JSON.stringify(search));

      const expectedActions = [{ type: deleteSatelliteSearchSuccess.type, payload: search.id }];

      await store.dispatch(deleteSavedSatelliteSearch(search.id));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch save satellite search failure action.', async () => {
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

      const expectedActions = [{ type: saveSatelliteSearchFailure.type, payload: { message: '401 Test Error' } }];

      const form = {
        name: 'Test Search Title',
        satellites: ['sentinel-1'],
        start_date: '2000-01-01T00:00:00Z',
        end_date: '2000-01-02T00:00:00Z',
        tiers: ['free'],
        aoi: [
          [-4.4642292869796165, 55.92440885733765],
          [-4.167081994951957, 55.92440885733765],
          [-4.167081994951957, 55.841075664393315],
          [-4.4642292869796165, 55.841075664393315],
          [-4.4642292869796165, 55.92440885733765]
        ]
      };

      await store.dispatch(saveSatelliteSearch(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch save satellite search success action.', async () => {
      const form = {
        name: 'Test Search Title',
        satellites: ['sentinel-1'],
        start_date: '2000-01-01T00:00:00Z',
        end_date: '2000-01-02T00:00:00Z',
        tiers: ['free'],
        aoi: [
          [-4.4642292869796165, 55.92440885733765],
          [-4.167081994951957, 55.92440885733765],
          [-4.167081994951957, 55.841075664393315],
          [-4.4642292869796165, 55.841075664393315],
          [-4.4642292869796165, 55.92440885733765]
        ]
      };

      const savedSearch = {
        ...form,
        id: 1
      };
      fetch.mockResponse(JSON.stringify(savedSearch));

      const expectedActions = [{ type: saveSatelliteSearchSuccess.type, payload: savedSearch }];

      await store.dispatch(saveSatelliteSearch(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch pinned scenes failure action.', async () => {
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

      const expectedActions = [{ type: fetchPinnedScenesFailure.type, payload: { message: '401 Test Error' } }];

      await store.dispatch(fetchPinnedScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch pinned scenes success action.', async () => {
      const scenes = [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        }
      ];

      fetch.mockResponse(JSON.stringify(scenes));

      const expectedActions = [{ type: fetchPinnedScenesSuccess.type, payload: scenes }];

      await store.dispatch(fetchPinnedScenes());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch pin scene failure action.', async () => {
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

      const expectedActions = [{ type: pinSceneFailure.type, payload: { message: '401 Test Error' } }];

      const form = {};
      await store.dispatch(pinScene(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch pin scene success action.', async () => {
      const scenes = [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        }
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
          message: 'Test error message'
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error'
        }
      );

      const expectedActions = [{ type: deletePinnedSceneFailure.type, payload: { message: '401 Test Error' } }];

      const form = {};
      await store.dispatch(deletePinnedScene(1));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete pinned scene success action.', async () => {
      const scene = {
        id: 1
      };

      fetch.mockResponse(JSON.stringify(scene));

      const expectedActions = [{ type: deletePinnedSceneSuccess.type, payload: scene.id }];

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
        currentSearchQuery: null
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
        payload: satellites
      });

      expect(actualState.satellites).toEqual(satellites);
    });

    it('should update the error state, when failed to retrieve satellites', () => {
      const error = { message: 'Test Satellites Error' };

      const actualState = reducer(beforeState, {
        type: fetchSatellitesFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the satellites scenes in state, when successfully retrieved', () => {
      const satellitesScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchSatelliteScenesSuccess.type,
        payload: satellitesScenes
      });

      expect(actualState.scenes).toEqual(satellitesScenes);
    });

    it('should update the error state, when failed to retrieve satellites scenes', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: fetchSatelliteScenesFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the selected scene in state, when one selected', () => {
      const scene = { id: 1 };

      const actualState = reducer(beforeState, {
        type: selectScene.type,
        payload: scene
      });

      expect(actualState.selectedScene).toEqual(scene);
    });

    it('should update the selected scenes in state, when they are cleared', () => {
      const actualState = reducer(beforeState, {
        type: removeScenes.type
      });

      expect(actualState.selectedScene).toEqual(null);
    });

    it('should update the saved satellite searches in state, when successfully saved a new search', () => {
      beforeState.satelliteSearches = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const searchToSave = { id: 5 };

      const actualState = reducer(beforeState, {
        type: saveSatelliteSearchSuccess.type,
        payload: searchToSave
      });

      expect(actualState.satelliteSearches).toEqual([...beforeState.satelliteSearches, searchToSave]);
    });

    it('should update the error state, when failed to save a satellites search', () => {
      const error = { message: 'Test Satellites Search Error' };

      const actualState = reducer(beforeState, {
        type: saveSatelliteSearchFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the saved satellite searches in state, when successfully deleted a search', () => {
      beforeState.satelliteSearches = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const searchToDelete = beforeState.satelliteSearches[1];

      const actualState = reducer(beforeState, {
        type: deleteSatelliteSearchSuccess.type,
        payload: searchToDelete.id
      });

      expect(actualState.satelliteSearches).toEqual(
        beforeState.satelliteSearches.filter(search => search.id !== searchToDelete.id)
      );
    });

    it('should update the error state, when failed to delete a satellites search', () => {
      const error = { message: 'Test Satellites Search Error' };

      const actualState = reducer(beforeState, {
        type: deleteSatelliteSearchFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the pinned satellite scenes in state, when successfully retrieved', () => {
      const pinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchPinnedScenesSuccess.type,
        payload: pinnedScenes
      });

      expect(actualState.pinnedScenes).toEqual(pinnedScenes);
    });

    it('should update the error state, when failed to fetch pinned scenes', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: fetchPinnedScenesFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the pinned satellite scenes in state, when successfully pinned scene', () => {
      const pinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: pinSceneSuccess.type,
        payload: pinnedScenes
      });

      expect(actualState.pinnedScenes).toEqual(pinnedScenes);
    });

    it('should update the error state, when failed to pin a new scene', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: pinSceneFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the pinned satellite scenes in state, when successfully deleted a pinned scene', () => {
      const pinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: deletePinnedSceneSuccess.type,
        payload: pinnedScenes
      });

      expect(actualState.pinnedScenes).toEqual(pinnedScenes);
    });

    it('should update the error state, when failed to delete a pinned scene', () => {
      const error = { message: 'Test Satellites Scenes Error' };

      const actualState = reducer(beforeState, {
        type: deletePinnedSceneFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the selected pinned satellite scenes in state, when a pinned scene selected, when none exist', () => {
      const selectedScene = { id: 1 };

      const actualState = reducer(beforeState, {
        type: selectPinnedScene.type,
        payload: selectedScene
      });

      expect(actualState.selectedPinnedScenes).toEqual([selectedScene]);
    });

    it('should update the selected pinned satellite scenes in state, when a pinned scene selected, when some already exist', () => {
      beforeState.selectedPinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const selectedScene = { id: 5 };

      const actualState = reducer(beforeState, {
        type: selectPinnedScene.type,
        payload: selectedScene
      });

      expect(actualState.selectedPinnedScenes).toEqual([...beforeState.selectedPinnedScenes, selectedScene]);
    });

    it('should update the selected pinned satellite scenes in state, when an existing pinned scene is deselected', () => {
      beforeState.selectedPinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const sceneToDelete = { id: 2 };

      const actualState = reducer(beforeState, {
        type: deselectPinnedScene.type,
        payload: sceneToDelete
      });

      expect(actualState.selectedPinnedScenes).toEqual([
        ...beforeState.selectedPinnedScenes.filter(scene => scene.id !== sceneToDelete.id)
      ]);
    });

    it("'should not update the selected pinned satellite scenes in state, when scene to deselected, doesn't exist", () => {
      beforeState.selectedPinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const sceneToDelete = { id: 5 };

      const actualState = reducer(beforeState, {
        type: deselectPinnedScene.type,
        payload: sceneToDelete
      });

      expect(actualState.selectedPinnedScenes).toEqual([
        ...beforeState.selectedPinnedScenes.filter(scene => scene.id !== sceneToDelete.id)
      ]);
    });

    it('should update the selected pinned satellite scenes in state, when scenes to be cleared', () => {
      beforeState.selectedPinnedScenes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: clearSelectedPinnedScenes.type
      });

      expect(actualState.selectedPinnedScenes).toEqual([]);
    });

    it('should update the current satellite search query in state', () => {
      const query = {
        id: 1
      };

      const actualState = reducer(beforeState, {
        type: setCurrentSatelliteSearchQuery.type,
        payload: query
      });

      expect(actualState.currentSearchQuery).toEqual(query);
    });
  });
});
