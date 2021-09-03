import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  addBookmark,
  deleteBookmark,
  fetchBookmarks,
  isLoaded,
  isLoadingSelector,
  selectBookmark,
} from './bookmarks.slice';

const mockStore = configureMockStore([thunk]);

describe('Bookmark Slice', () => {
  describe('Bookmark Actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore();
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

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchBookmarks.rejected.type,
          payload: { message: '401 Test Error' },
        }),
      ]);

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

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchBookmarks.fulfilled.type,
          payload: bookmarks,
        }),
      ]);

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

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: addBookmark.rejected.type,
          payload: { message: '401 Test Error' },
        }),
      ]);

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

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: addBookmark.fulfilled.type,
          payload: bookmark,
        }),
      ]);

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

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: deleteBookmark.rejected.type,
          payload: { message: '401 Test Error' },
        }),
      ]);

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

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: deleteBookmark.fulfilled.type,
          payload: bookmark,
        }),
      ]);

      await store.dispatch(deleteBookmark(bookmark));

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

    it('should update the bookmarks in state, when successfully retrieved', () => {
      const bookmarks = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      const actualState = reducer(beforeState, {
        type: fetchBookmarks.fulfilled.type,
        payload: bookmarks,
      });

      expect(actualState.bookmarks).toEqual(bookmarks);
    });

    it('should update the error state, when failed to retrieve bookmarks', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: fetchBookmarks.rejected.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the bookmarks in state, when successfully added a new bookmark', () => {
      const bookmark = { id: 5 };

      const actualState = reducer(beforeState, {
        type: addBookmark.fulfilled.type,
        payload: bookmark,
      });

      expect(actualState.bookmarks).toEqual([bookmark]);
    });

    it('should update the error state, when failed to add a new bookmarks', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: addBookmark.rejected.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the bookmarks in state, when successfully deleted a bookmark', () => {
      const bookmark = { id: 1 };
      beforeState.bookmarks = [{ id: 1 }, { id: 2 }];

      const actualState = reducer(beforeState, {
        type: deleteBookmark.fulfilled.type,
        payload: bookmark,
      });

      expect(actualState.bookmarks).toEqual(
        beforeState.bookmarks.filter(bm => bm.id !== bookmark.id),
      );
    });

    it('should update the error state, when failed to delete a bookmark', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: deleteBookmark.rejected.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });
  });

  describe('selectors', () => {
    describe('isLoadingSelector', () => {
      it('returns false if state is undefined', () => {
        const result = isLoadingSelector();
        expect(result).toBe(false);
      });

      it('returns false if bookmarks is undefined', () => {
        const state = {};
        const result = isLoadingSelector(state);
        expect(result).toBe(false);
      });

      it('returns false if isLoading is undefined', () => {
        const state = { bookmarks: {} };
        const result = isLoadingSelector(state);
        expect(result).toBe(false);
      });

      it('returns isLoading', () => {
        const state = { bookmarks: { isLoading: true } };
        const result = isLoadingSelector(state);
        expect(result).toEqual(state.bookmarks.isLoading);
      });
    });
  });
});
