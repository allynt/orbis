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

const initialState = {
  bookmarks: null,
  selectedBookmark: null,
  error: null,
  isLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOKMARKS_SUCCESS:
      return {
        ...state,
        bookmarks: action.bookmarks,
        error: null
      };

    case FETCH_BOOKMARKS_FAILURE:
      return { ...state, error: action.error };

    case ADD_BOOKMARK_SUCCESS:
      const bookmarks = [...state.bookmarks, action.bookmark];
      return {
        ...state,
        bookmarks,
        selectedBookmark: action.bookmark,
        error: null
      };

    case ADD_BOOKMARK_FAILURE:
      return { ...state, error: action.error };

    case DELETE_BOOKMARK_SUCCESS:
      const filteredBookmarks = state.bookmarks.filter(bookmark => bookmark.id !== action.bookmark.id);
      const isSelectedBookmark = state.selectedBookmark && state.selectedBookmark.id === action.bookmark.id;
      const selectedBookmark = isSelectedBookmark ? null : state.selectedBookmark;
      return {
        ...state,
        bookmarks: filteredBookmarks,
        selectedBookmark: selectedBookmark,
        error: null
      };

    case DELETE_BOOKMARK_FAILURE:
      return { ...state, error: action.error };

    case SELECT_BOOKMARK:
      if (action.bookmark !== state.selectedBookmark) {
        return { ...state, selectedBookmark: action.bookmark, isLoading: true };
      }
    case IS_LOADED:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default reducer;
