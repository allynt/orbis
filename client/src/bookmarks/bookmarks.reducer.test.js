import reducer from './bookmarks.reducer';
import {
  FETCH_BOOKMARKS_SUCCESS,
  FETCH_BOOKMARKS_FAILURE,
  ADD_BOOKMARK_SUCCESS,
  ADD_BOOKMARK_FAILURE,
  DELETE_BOOKMARK_SUCCESS,
  DELETE_BOOKMARK_FAILURE,
  SELECT_BOOKMARK,
  IS_LOADED
} from './bookmarks.actions';

describe('Bookmarks reducer', () => {
  let initialState = null;

  beforeEach(() => {
    initialState = {
      bookmarks: null,
      selectedBookmark: null,
      error: null,
      isLoading: false
    };
  });

  it('should return the initial state', () => {
    const actualState = reducer(undefined, {});

    expect(actualState).toEqual(expect.objectContaining(initialState));
  });

  it('should update the bookmarks list in state', () => {
    const bookmarks = [
      {
        id: 1,
        name: 'Bookmark 1'
      },
      {
        id: 2,
        name: 'Bookmark 2'
      }
    ];
    const actualState = reducer(initialState, {
      type: FETCH_BOOKMARKS_SUCCESS,
      bookmarks
    });

    expect(actualState.bookmarks).toEqual(bookmarks);
  });

  it('should set the error state, when failed to retrieve bookmarks', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: FETCH_BOOKMARKS_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should add the new bookmark to the empty list in state', () => {
    initialState.bookmarks = [];
    const bookmark = {
      id: 3,
      name: 'New Bookmark 3'
    };

    const actualState = reducer(initialState, {
      type: ADD_BOOKMARK_SUCCESS,
      bookmark
    });

    expect(actualState.bookmarks).toEqual([...initialState.bookmarks, bookmark]);
  });

  it('should add the new bookmark to the populated list in state', () => {
    initialState.bookmarks = [
      {
        id: 1,
        name: 'Bookmark 1'
      },
      {
        id: 2,
        name: 'Bookmark 2'
      }
    ];
    const bookmark = {
      id: 3,
      name: 'New Bookmark 3'
    };

    const actualState = reducer(initialState, {
      type: ADD_BOOKMARK_SUCCESS,
      bookmark
    });

    expect(actualState.bookmarks).toEqual([...initialState.bookmarks, bookmark]);
  });

  it('should set the error state, when failed to add a bookmark', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: ADD_BOOKMARK_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should delete the selected bookmark in state', () => {
    initialState.bookmarks = [
      {
        id: 1,
        name: 'Bookmark 1'
      },
      {
        id: 2,
        name: 'Bookmark 2'
      }
    ];
    const bookmark = initialState.bookmarks[1];

    const actualState = reducer(initialState, {
      type: DELETE_BOOKMARK_SUCCESS,
      bookmark
    });

    expect(actualState.bookmarks).toEqual(initialState.bookmarks.filter(book => book.id !== bookmark.id));
  });

  it('should set the error state, when failed to delete bookmark', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: DELETE_BOOKMARK_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should set the selected bookmark in state', () => {
    initialState.bookmarks = [
      {
        id: 1,
        name: 'Bookmark 1'
      },
      {
        id: 2,
        name: 'Bookmark 2'
      }
    ];
    const bookmark = initialState.bookmarks[1];

    const actualState = reducer(initialState, {
      type: SELECT_BOOKMARK,
      bookmark
    });

    expect(actualState.selectedBookmark).toEqual(bookmark);
  });

  // it('should update the satellite searches list in state', () => {
  //   const searches = [
  //     {
  //       id: 1,
  //       name: 'Satellite Search 1'
  //     },
  //     {
  //       id: 2,
  //       name: 'Satellite Search 2'
  //     }
  //   ];
  //   const actualState = reducer(initialState, {
  //     type: FETCH_SATELLITE_SEARCHES_SUCCESS,
  //     searches
  //   });

  //   expect(actualState.satelliteSearches).toEqual(searches);
  // });

  // it('should set the error state, when failed to retrieve saved satellite searches', () => {
  //   const error = 'ERROR';
  //   const actualState = reducer(initialState, {
  //     type: FETCH_SATELLITE_SEARCHES_FAILURE,
  //     error
  //   });

  //   expect(actualState.error).toEqual(error);
  // });

  // it('should update the satellite searches list in state with new saved search', () => {
  //   const searches = [
  //     {
  //       id: 1,
  //       name: 'Satellite Search 1'
  //     },
  //     {
  //       id: 2,
  //       name: 'Satellite Search 2'
  //     }
  //   ];
  //   initialState.satelliteSearches = searches;
  //   const savedSearch = {
  //     id: 3,
  //     name: 'Saved Satellite Search 3'
  //   };
  //   const actualState = reducer(initialState, {
  //     type: SAVE_SATELLITE_SEARCH_REQUESTED_SUCCESS,
  //     savedSearch
  //   });

  //   expect(actualState.satelliteSearches).toEqual([...searches, savedSearch]);
  // });

  // it('should set the error state, when failed to retrieve saved satellite searches', () => {
  //   const error = 'ERROR';
  //   const actualState = reducer(initialState, {
  //     type: SAVE_SATELLITE_SEARCH_REQUESTED_FAILURE,
  //     error
  //   });

  //   expect(actualState.error).toEqual(error);
  // });

  // it('should remove the specified satellite search from the list in state', () => {
  //   const searches = [
  //     {
  //       id: 1,
  //       name: 'Satellite Search 1'
  //     },
  //     {
  //       id: 2,
  //       name: 'Satellite Search 2'
  //     }
  //   ];
  //   initialState.satelliteSearches = searches;
  //   const actualState = reducer(initialState, {
  //     type: DELETE_SATELLITE_SEARCH_SUCCESS,
  //     searches: searches
  //   });

  //   expect(actualState.satelliteSearches).toEqual(searches);
  // });

  // it('should set the error state, when failed to remove the specified satellite search from the list in state', () => {
  //   const error = 'ERROR';
  //   const actualState = reducer(initialState, {
  //     type: DELETE_SATELLITE_SEARCH_FAILURE,
  //     error
  //   });

  //   expect(actualState.error).toEqual(error);
  // });

  // it('should update the satellite pinned scenes list in state', () => {
  //   const scenes = [
  //     {
  //       id: 1,
  //       name: 'Satellite Scene 1'
  //     },
  //     {
  //       id: 2,
  //       name: 'Satellite Scene 2'
  //     }
  //   ];

  //   const actualState = reducer(initialState, {
  //     type: FETCH_PINNED_SCENES_SUCCESS,
  //     scenes
  //   });

  //   expect(actualState.pinnedScenes).toEqual(scenes);
  // });

  // it('should set the error state, when failed to retrieve pinned scenes', () => {
  //   const error = 'ERROR';
  //   const actualState = reducer(initialState, {
  //     type: FETCH_PINNED_SCENES_FAILURE,
  //     error
  //   });

  //   expect(actualState.error).toEqual(error);
  // });

  // it('should update the satellite pinned scenes list in state, with newly added scene', () => {
  //   const scenes = [
  //     {
  //       id: 1,
  //       name: 'Satellite Scene 1'
  //     },
  //     {
  //       id: 2,
  //       name: 'Satellite Scene 2'
  //     }
  //   ];

  //   const actualState = reducer(initialState, {
  //     type: PIN_SCENE_SUCCESS,
  //     scenes
  //   });

  //   expect(actualState.pinnedScenes).toEqual(scenes);
  // });

  // it('should set the error state, when failed to pin a satellite scene', () => {
  //   const error = 'ERROR';
  //   const actualState = reducer(initialState, {
  //     type: PIN_SCENE_FAILURE,
  //     error
  //   });

  //   expect(actualState.error).toEqual(error);
  // });

  // it('should remove the specified pinned scene from the list in state', () => {
  //   const scenes = [
  //     {
  //       id: 1,
  //       name: 'Satellite Scene 1'
  //     },
  //     {
  //       id: 2,
  //       name: 'Satellite Scene 2'
  //     }
  //   ];

  //   const actualState = reducer(initialState, {
  //     type: DELETE_PINNED_SCENE_SUCCESS,
  //     scenes
  //   });

  //   expect(actualState.pinnedScenes).toEqual(scenes);
  // });

  // it('should set the error state, when failed to remove pinned scene from state', () => {
  //   const error = 'ERROR';
  //   const actualState = reducer(initialState, {
  //     type: DELETE_PINNED_SCENE_FAILURE,
  //     error
  //   });

  //   expect(actualState.error).toEqual(error);
  // });

  // it('should update the list of pinned scenes in state', () => {
  //   const scenes = [
  //     {
  //       id: 1,
  //       name: 'Scene 1'
  //     },
  //     {
  //       id: 2,
  //       name: 'Scene 2'
  //     }
  //   ];

  //   let actualState = reducer(initialState, {
  //     type: SELECT_PINNED_SCENE,
  //     scene: scenes[0]
  //   });

  //   expect(actualState.selectedPinnedScenes).toEqual([scenes[0]]);

  //   actualState = reducer(actualState, {
  //     type: SELECT_PINNED_SCENE,
  //     scene: scenes[1]
  //   });

  //   expect(actualState.selectedPinnedScenes).toEqual(scenes);
  // });

  // it('should clear the list of pinned scenes in state', () => {
  //   const scenes = [
  //     {
  //       id: 1,
  //       name: 'Scene 1'
  //     },
  //     {
  //       id: 2,
  //       name: 'Scene 2'
  //     }
  //   ];

  //   initialState.selectedPinnedScenes = scenes;
  //   const actualState = reducer(initialState, {
  //     type: CLEAR_SELECTED_PINNED_SCENES
  //   });

  //   expect(actualState.selectedPinnedScenes).toEqual([]);
  // });

  // it('should clear the list of pinned scenes in state', () => {
  //   const query = {
  //     id: 1,
  //     name: 'Test Query'
  //   };

  //   const actualState = reducer(initialState, {
  //     type: SET_CURRENT_SATELLITE_SEARCH_QUERY,
  //     query
  //   });

  //   expect(actualState.currentSearchQuery).toEqual(query);
  // });
});
