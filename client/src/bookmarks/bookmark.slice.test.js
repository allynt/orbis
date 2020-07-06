import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  fetchBookmarksSuccess,
  fetchBookmarksFailure,
  fetchBookmarks,
  addBookmarkSuccess,
  addBookmarkFailure,
  addBookmark,
  deleteBookmarkSuccess,
  deleteBookmarkFailure,
  deleteBookmark,
  selectBookmark,
  isLoaded,
} from './bookmark.slice';

const mockStore = configureMockStore([thunk]);

describe('Bookmark Slice', () => {
  describe('Bookmark Actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: { userKey: 'Test-User-Key' },
      });
    });

    it('should dispatch fetch bookmarks failure action.', async () => {
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
          type: fetchBookmarksFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

      await store.dispatch(fetchBookmarks());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch bookmarks success action.', async () => {
      const bookmarks = [
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
      fetch.mockResponse(JSON.stringify(bookmarks));

      const expectedActions = [
        { type: fetchBookmarksSuccess.type, payload: bookmarks },
      ];

      await store.dispatch(fetchBookmarks());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch add bookmark failure action.', async () => {
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
          type: addBookmarkFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

      const bookmark = {
        id: 5,
      };
      await store.dispatch(addBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch add bookmark success action.', async () => {
      const bookmark = {
        id: 5,
      };
      fetch.mockResponse(JSON.stringify(bookmark));

      const expectedActions = [
        { type: addBookmarkSuccess.type, payload: bookmark },
      ];

      await store.dispatch(addBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete bookmark failure action.', async () => {
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
          type: deleteBookmarkFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

      const bookmark = {
        id: 5,
      };
      await store.dispatch(deleteBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete bookmark success action.', async () => {
      const bookmark = {
        id: 5,
      };
      fetch.mockResponse(JSON.stringify(bookmark));

      const expectedActions = [
        { type: deleteBookmarkSuccess.type, payload: bookmark },
      ];

      await store.dispatch(deleteBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch select bookmark action.', async () => {
      const bookmark = {
        id: 5,
      };

      const expectedActions = [
        { type: selectBookmark.type, payload: bookmark },
      ];

      await store.dispatch(selectBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Bookmark Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        bookmarks: null,
        selectedBookmark: null,
        error: null,
        isLoading: false,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the bookmarks in state, when successfully retrieved', () => {
      const bookmarks = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchBookmarksSuccess.type,
        payload: bookmarks,
      });

      expect(actualState.bookmarks).toEqual(bookmarks);
    });

    it('should update the error state, when failed to retrieve bookmarks', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: fetchBookmarksFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the bookmarks in state, when successfully added a new bookmark', () => {
      const bookmark = { id: 5 };

      const actualState = reducer(beforeState, {
        type: addBookmarkSuccess.type,
        payload: bookmark,
      });

      expect(actualState.bookmarks).toEqual([bookmark]);
    });

    it('should update the error state, when failed to add a new bookmarks', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: addBookmarkFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the bookmarks in state, when successfully deleted a bookmark', () => {
      const bookmark = { id: 1 };
      beforeState.bookmarks = [{ id: 1 }, { id: 2 }];

      const actualState = reducer(beforeState, {
        type: deleteBookmarkSuccess.type,
        payload: bookmark,
      });

      expect(actualState.bookmarks).toEqual(
        beforeState.bookmarks.filter(bm => bm.id !== bookmark.id),
      );
    });

    it('should update the error state, when failed to delete a bookmark', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: deleteBookmarkFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the selected bookmark in state, when one selected', () => {
      const bookmark = { id: 1 };
      beforeState.bookmarks = [{ id: 1 }, { id: 2 }];

      const actualState = reducer(beforeState, {
        type: selectBookmark.type,
        payload: bookmark,
      });

      expect(actualState.selectedBookmark).toEqual(bookmark);
    });

    it('should update the selected bookmark in state, when one selected', () => {
      const actualState = reducer(beforeState, {
        type: isLoaded.type,
      });

      expect(actualState.isLoading).toEqual(false);
    });
  });
});
