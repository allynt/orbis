import reducer from './satellites.reducer';
import {
  FETCH_SATELLITES_SUCCESS,
  FETCH_SATELLITES_FAILURE,
  FETCH_SATELLITE_SCENES_SUCCESS,
  FETCH_SATELLITE_SCENES_FAILURE,
  SELECT_SCENE,
  REMOVE_SCENES,
  FETCH_SATELLITE_SEARCHES_SUCCESS,
  FETCH_SATELLITE_SEARCHES_FAILURE,
  SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS,
  SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE,
  DELETE_SATELLITE_SEARCH_SUCCESS,
  DELETE_SATELLITE_SEARCH_FAILURE,
  SET_CURRENT_SATELLITE_SEARCH_QUERY,
  FETCH_PINNED_SCENES_SUCCESS,
  FETCH_PINNED_SCENES_FAILURE,
  PIN_SCENE_SUCCESS,
  PIN_SCENE_FAILURE,
  SELECT_PINNED_SCENE,
  CLEAR_SELECTED_PINNED_SCENES,
  DELETE_PINNED_SCENE_SUCCESS,
  DELETE_PINNED_SCENE_FAILURE
} from './satellites.actions';

describe('Satellites reducer', () => {
  let initialState = null;

  beforeEach(() => {
    initialState = {
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

    expect(actualState).toEqual(expect.objectContaining(initialState));
  });

  it('should update the satellites list in state', () => {
    const satellites = [
      {
        id: 1,
        name: 'Satellite 1'
      },
      {
        id: 2,
        name: 'Satellite 2'
      }
    ];
    const actualState = reducer(initialState, {
      type: FETCH_SATELLITES_SUCCESS,
      satellites
    });

    expect(actualState.satellites).toEqual(satellites);
  });

  it('should set the error state, when failed to retrieve satellites', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: FETCH_SATELLITES_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should update the satellite scenes list in state', () => {
    const scenes = [
      {
        id: 1,
        name: 'Scene 1'
      },
      {
        id: 2,
        name: 'Scene 2'
      }
    ];
    const actualState = reducer(initialState, {
      type: FETCH_SATELLITE_SCENES_SUCCESS,
      scenes
    });

    expect(actualState.scenes).toEqual(scenes);
  });

  it('should set the error state, when failed to retrieve satellite scenes', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: FETCH_SATELLITE_SCENES_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should update the selected scene object in state', () => {
    const scenes = [
      {
        id: 1,
        name: 'Scene 1'
      },
      {
        id: 2,
        name: 'Scene 2'
      }
    ];
    const actualState = reducer(initialState, {
      type: SELECT_SCENE,
      scene: scenes[1]
    });

    expect(actualState.selectedScene).toEqual(scenes[1]);
  });

  it('should remove the selected scene object in state when moving from visualisations panel', () => {
    const scene = {
      id: 1,
      name: 'Scene 1'
    };
    initialState.selectedScene = scene;

    const actualState = reducer(initialState, {
      type: REMOVE_SCENES
    });

    expect(actualState.selectedScene).toEqual(null);
  });

  it('should update the satellite searches list in state', () => {
    const searches = [
      {
        id: 1,
        name: 'Satellite Search 1'
      },
      {
        id: 2,
        name: 'Satellite Search 2'
      }
    ];
    const actualState = reducer(initialState, {
      type: FETCH_SATELLITE_SEARCHES_SUCCESS,
      searches
    });

    expect(actualState.satelliteSearches).toEqual(searches);
  });

  it('should set the error state, when failed to retrieve saved satellite searches', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: FETCH_SATELLITE_SEARCHES_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should update the satellite searches list in state with new saved search', () => {
    const searches = [
      {
        id: 1,
        name: 'Satellite Search 1'
      },
      {
        id: 2,
        name: 'Satellite Search 2'
      }
    ];
    initialState.satelliteSearches = searches;
    const savedSearch = {
      id: 3,
      name: 'Saved Satellite Search 3'
    };
    const actualState = reducer(initialState, {
      type: SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS,
      savedSearch
    });

    expect(actualState.satelliteSearches).toEqual([...searches, savedSearch]);
  });

  it('should set the error state, when failed to retrieve saved satellite searches', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should remove the specified satellite search from the list in state', () => {
    const searches = [
      {
        id: 1,
        name: 'Satellite Search 1'
      },
      {
        id: 2,
        name: 'Satellite Search 2'
      }
    ];
    initialState.satelliteSearches = searches;
    const actualState = reducer(initialState, {
      type: DELETE_SATELLITE_SEARCH_SUCCESS,
      searches: searches
    });

    expect(actualState.satelliteSearches).toEqual(searches);
  });

  it('should set the error state, when failed to remove the specified satellite search from the list in state', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: DELETE_SATELLITE_SEARCH_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should update the satellite pinned scenes list in state', () => {
    const scenes = [
      {
        id: 1,
        name: 'Satellite Scene 1'
      },
      {
        id: 2,
        name: 'Satellite Scene 2'
      }
    ];

    const actualState = reducer(initialState, {
      type: FETCH_PINNED_SCENES_SUCCESS,
      scenes
    });

    expect(actualState.pinnedScenes).toEqual(scenes);
  });

  it('should set the error state, when failed to retrieve pinned scenes', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: FETCH_PINNED_SCENES_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should update the satellite pinned scenes list in state, with newly added scene', () => {
    const scenes = [
      {
        id: 1,
        name: 'Satellite Scene 1'
      },
      {
        id: 2,
        name: 'Satellite Scene 2'
      }
    ];

    const actualState = reducer(initialState, {
      type: PIN_SCENE_SUCCESS,
      scenes
    });

    expect(actualState.pinnedScenes).toEqual(scenes);
  });

  it('should set the error state, when failed to pin a satellite scene', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: PIN_SCENE_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should remove the specified pinned scene from the list in state', () => {
    const scenes = [
      {
        id: 1,
        name: 'Satellite Scene 1'
      },
      {
        id: 2,
        name: 'Satellite Scene 2'
      }
    ];

    const actualState = reducer(initialState, {
      type: DELETE_PINNED_SCENE_SUCCESS,
      scenes
    });

    expect(actualState.pinnedScenes).toEqual(scenes);
  });

  it('should set the error state, when failed to remove pinned scene from state', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: DELETE_PINNED_SCENE_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should update the list of pinned scenes in state', () => {
    const scenes = [
      {
        id: 1,
        name: 'Scene 1'
      },
      {
        id: 2,
        name: 'Scene 2'
      }
    ];

    let actualState = reducer(initialState, {
      type: SELECT_PINNED_SCENE,
      scene: scenes[0]
    });

    expect(actualState.selectedPinnedScenes).toEqual([scenes[0]]);

    actualState = reducer(actualState, {
      type: SELECT_PINNED_SCENE,
      scene: scenes[1]
    });

    expect(actualState.selectedPinnedScenes).toEqual(scenes);
  });

  it('should clear the list of pinned scenes in state', () => {
    const scenes = [
      {
        id: 1,
        name: 'Scene 1'
      },
      {
        id: 2,
        name: 'Scene 2'
      }
    ];

    initialState.selectedPinnedScenes = scenes;
    const actualState = reducer(initialState, {
      type: CLEAR_SELECTED_PINNED_SCENES
    });

    expect(actualState.selectedPinnedScenes).toEqual([]);
  });

  it('should clear the list of pinned scenes in state', () => {
    const query = {
      id: 1,
      name: 'Test Query'
    };

    const actualState = reducer(initialState, {
      type: SET_CURRENT_SATELLITE_SEARCH_QUERY,
      query
    });

    expect(actualState.currentSearchQuery).toEqual(query);
  });
});
