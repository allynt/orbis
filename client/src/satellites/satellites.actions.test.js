import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  FETCH_SATELLITES_SUCCESS,
  FETCH_SATELLITES_FAILURE,
  fetchSatellites,
  FETCH_SATELLITE_SCENES_SUCCESS,
  FETCH_SATELLITE_SCENES_FAILURE,
  fetchSatelliteScenes,
  SELECT_SCENE,
  selectScene,
  REMOVE_SCENES,
  removeScenes,
  FETCH_SATELLITE_SEARCHES_SUCCESS,
  FETCH_SATELLITE_SEARCHES_FAILURE,
  fetchSavedSatelliteSearches,
  DELETE_SATELLITE_SEARCH_SUCCESS,
  DELETE_SATELLITE_SEARCH_FAILURE,
  deleteSavedSatelliteSearch,
  SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS,
  SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE,
  saveSatelliteSearch,
  FETCH_PINNED_SCENES_SUCCESS,
  FETCH_PINNED_SCENES_FAILURE,
  fetchPinnedScenes,
  PIN_SCENE_SUCCESS,
  PIN_SCENE_FAILURE,
  pinScene,
  SELECT_PINNED_SCENE,
  selectPinnedScene,
  CLEAR_SELECTED_PINNED_SCENES,
  clearSelectedPinnedScenes,
  DELETE_PINNED_SCENE_SUCCESS,
  DELETE_PINNED_SCENE_FAILURE,
  deletePinnedScene,
  SET_CURRENT_SATELLITE_SEARCH_QUERY,
  setCurrentSearchQuery
} from './satellites.actions';

const mockStore = configureMockStore([thunk]);

describe('Satellites Actions', () => {
  beforeEach(() => {
    fetch.resetMocks();
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

    const expectedActions = [{ type: FETCH_SATELLITES_FAILURE, error: { message: '401 Test Error' } }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    await store.dispatch(fetchSatellites());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch fetch satellites success action.', async () => {
    const satellites = [
      {
        id: 1,
        name: 'Name 1'
      },
      {
        id: 2,
        name: 'Name 2'
      }
    ];
    fetch.mockResponse(JSON.stringify(satellites));

    const expectedActions = [{ type: FETCH_SATELLITES_SUCCESS, satellites }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      },
      satellites: {
        satellites: []
      }
    });

    await store.dispatch(fetchSatellites());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch fetch satellite scenes failure action.', async () => {
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

    const expectedAction = { type: FETCH_SATELLITE_SCENES_FAILURE, error: { message: '401 Test Error' } };

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    const query = {};
    await store.dispatch(fetchSatelliteScenes(query));

    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it('should dispatch fetch satellites scenes success action.', async () => {
    const scenes = [
      {
        id: 1,
        name: 'Name 1'
      },
      {
        id: 2,
        name: 'Name 2'
      }
    ];
    fetch.mockResponse(JSON.stringify(scenes));

    const expectedAction = { type: FETCH_SATELLITE_SCENES_SUCCESS, scenes };

    const store = mockStore({
      accounts: {
        userKey: '1234'
      },
      satellites: {
        satellites: []
      }
    });

    const query = {};
    await store.dispatch(fetchSatelliteScenes(query));

    expect(store.getActions()).toContainEqual(expectedAction);
  });

  it('should call selectScene action creator.', () => {
    const scenes = [
      {
        id: 'test-scene-1'
      },
      {
        id: 'test-scene-2'
      }
    ];

    const expectedActions = [{ type: SELECT_SCENE, scene: scenes[0] }];

    const store = mockStore({
      satellites: {
        scenes
      }
    });

    const scene = {};
    store.dispatch(selectScene(scenes[0]));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should call removeScenes action creator.', () => {
    const expectedActions = [{ type: REMOVE_SCENES }];

    const store = mockStore({});

    store.dispatch(removeScenes());

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

    const expectedActions = [{ type: FETCH_SATELLITE_SEARCHES_FAILURE, error: { message: '401 Test Error' } }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    await store.dispatch(fetchSavedSatelliteSearches());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch fetch saved satellite searches success action.', async () => {
    const searches = [
      {
        id: 1,
        name: 'Name 1'
      },
      {
        id: 2,
        name: 'Name 2'
      }
    ];
    fetch.mockResponse(JSON.stringify(searches));

    const expectedActions = [{ type: FETCH_SATELLITE_SEARCHES_SUCCESS, searches }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      },
      satellites: {
        satellites: []
      }
    });

    await store.dispatch(fetchSavedSatelliteSearches());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch delete saved satellite search failure action.', async () => {
    const id = 1;
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

    const expectedActions = [{ type: DELETE_SATELLITE_SEARCH_FAILURE, error: { message: '401 Test Error' } }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    await store.dispatch(deleteSavedSatelliteSearch(id));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch delete saved satellite search success action.', async () => {
    const id = 1;
    fetch.mockResponse(JSON.stringify(id));

    const expectedActions = [{ type: DELETE_SATELLITE_SEARCH_SUCCESS, id }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      },
      satellites: {
        satellites: []
      }
    });

    await store.dispatch(deleteSavedSatelliteSearch(id));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch save satellite search failure action.', async () => {
    const form = {
      id: 1,
      name: 'test-name'
    };
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

    const expectedActions = [{ type: SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE, error: { message: '401 Test Error' } }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    await store.dispatch(saveSatelliteSearch(form));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch save satellite search success action.', async () => {
    const form = {
      id: 1,
      name: 'test-name'
    };
    fetch.mockResponse(JSON.stringify(form));

    const expectedActions = [{ type: SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS, savedSearch: form }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      },
      satellites: {
        satellites: []
      }
    });

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

    const expectedActions = [{ type: FETCH_PINNED_SCENES_FAILURE, error: { message: '401 Test Error' } }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    await store.dispatch(fetchPinnedScenes());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch fetch pinned scenes success action.', async () => {
    const scenes = [
      {
        id: 1,
        name: 'Name 1'
      },
      {
        id: 2,
        name: 'Name 2'
      }
    ];
    fetch.mockResponse(JSON.stringify(scenes));

    const expectedActions = [{ type: FETCH_PINNED_SCENES_SUCCESS, scenes }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      },
      satellites: {
        satellites: []
      }
    });

    await store.dispatch(fetchPinnedScenes());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch pin scene failure action.', async () => {
    const form = {
      id: 1,
      name: 'test-name'
    };

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

    const expectedActions = [{ type: PIN_SCENE_FAILURE, error: { message: '401 Test Error' } }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    await store.dispatch(pinScene(form));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch pin scene success action.', async () => {
    const form = {
      id: 1,
      name: 'test-name'
    };
    fetch.mockResponse(JSON.stringify(form));

    const expectedActions = [{ type: PIN_SCENE_SUCCESS, scene: form }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      },
      satellites: {
        satellites: []
      }
    });

    await store.dispatch(pinScene(form));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should call selectPinnedScene action creator.', () => {
    const scene = {
      id: 'test-scene-1',
      name: 'Test Scene Name'
    };

    const expectedActions = [{ type: SELECT_PINNED_SCENE, scene }];

    const store = mockStore({});

    store.dispatch(selectPinnedScene(scene));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should call clearSelectedPinnedScenes action creator.', () => {
    const expectedActions = [{ type: CLEAR_SELECTED_PINNED_SCENES }];

    const store = mockStore({});

    store.dispatch(clearSelectedPinnedScenes());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch delete pinned scene failure action.', async () => {
    const id = 1;
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

    const expectedActions = [{ type: DELETE_PINNED_SCENE_FAILURE, error: { message: '401 Test Error' } }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    await store.dispatch(deletePinnedScene(id));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch delete pinned scene success action.', async () => {
    const id = 1;
    fetch.mockResponse(JSON.stringify(id));

    const expectedActions = [{ type: DELETE_PINNED_SCENE_SUCCESS, id }];

    const store = mockStore({
      accounts: {
        userKey: '1234'
      }
    });

    await store.dispatch(deletePinnedScene(id));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should call setCurrentSearchQuery action creator.', () => {
    const query = {
      id: 1,
      name: 'test-scene-1'
    };

    const expectedActions = [{ type: SET_CURRENT_SATELLITE_SEARCH_QUERY, query }];

    const store = mockStore({});

    store.dispatch(setCurrentSearchQuery(query));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
