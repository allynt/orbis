import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  FETCH_BOOKMARKS_SUCCESS,
  FETCH_BOOKMARKS_FAILURE,
  fetchBookmarks,
  ADD_BOOKMARK_SUCCESS,
  ADD_BOOKMARK_FAILURE,
  addBookmark,
  DELETE_BOOKMARK_SUCCESS,
  DELETE_BOOKMARK_FAILURE,
  deleteBookmark,
  SELECT_BOOKMARK,
  selectBookmark
} from './bookmarks.actions';

const mockStore = configureMockStore([thunk]);

describe('Bookmarks Actions', () => {
  describe('Fetch Bookmarks', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    it('should dispatch fetch bookmarks failure action.', async () => {
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

      const expectedActions = [{ type: FETCH_BOOKMARKS_FAILURE, error: { message: '401 Test Error' } }];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      await store.dispatch(fetchBookmarks());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch bookmarks success action.', async () => {
      const bookmarks = [
        {
          id: 1,
          name: 'Test Bookmark 1'
        },
        {
          id: 2,
          name: 'Test Bookmark 1'
        }
      ];
      fetch.mockResponse(JSON.stringify(bookmarks));

      const expectedActions = [{ type: FETCH_BOOKMARKS_SUCCESS, bookmarks }];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      await store.dispatch(fetchBookmarks());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Add Bookmark', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    it('should dispatch add bookmark failure action.', async () => {
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

      const expectedActions = [{ type: ADD_BOOKMARK_FAILURE, error: { message: '401 Test Error' } }];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      const bookmark = {
        id: 3,
        name: 'New Bookmark 1'
      };
      await store.dispatch(addBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch add bookmark success action.', async () => {
      const bookmark = {
        id: 3,
        name: 'New Bookmark 1'
      };

      fetch.mockResponse(JSON.stringify(bookmark));

      const expectedActions = [{ type: ADD_BOOKMARK_SUCCESS, bookmark }];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      await store.dispatch(addBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Delete Bookmark', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    it('should dispatch add bookmark failure action.', async () => {
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

      const expectedActions = [{ type: DELETE_BOOKMARK_FAILURE, error: { message: '401 Test Error' } }];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      const bookmark = {
        id: 3,
        name: 'New Bookmark 1'
      };
      await store.dispatch(deleteBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete bookmark success action.', async () => {
      const bookmark = {
        id: 3,
        name: 'New Bookmark 1'
      };

      fetch.mockResponse(JSON.stringify(bookmark));

      const expectedActions = [{ type: DELETE_BOOKMARK_SUCCESS, bookmark }];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      await store.dispatch(deleteBookmark(bookmark));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Select Bookmark', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    it('should dispatch select bookmark action.', async () => {
      const bookmarks = [
        {
          id: 1,
          name: 'Test Bookmark 1'
        },
        {
          id: 2,
          name: 'Test Bookmark 1'
        }
      ];
      const expectedActions = [{ type: SELECT_BOOKMARK, bookmark: bookmarks[1] }];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        },
        bookmarks: {
          bookmarks
        }
      });

      await store.dispatch(selectBookmark(bookmarks[1]));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
