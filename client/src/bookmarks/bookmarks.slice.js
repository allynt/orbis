import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';

/**
 * @typedef BookmarksState
 * @property {import('typings').Bookmark[]} [bookmarks]
 * @property {import('typings').Bookmark} [selectedBookmark]
 * @property {any} [error]
 * @property {boolean} isLoading
 */

const name = 'bookmarks';

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<import('typings').Bookmark[], undefined, {}>}
 */
export const fetchBookmarks = createAsyncThunk(
  `${name}/fetchBookmarks`,
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.bookmarks.getBookmarks();
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Fetching Bookmark Error - ${message}`,
        50000,
        () => {},
      );
      return rejectWithValue({ message: `${status} ${message}` });
    }
  },
);

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  import('typings').Bookmark,
 *  import('typings').RequestBookmark,
 *  {}
 * >}
 */
export const addBookmark = createAsyncThunk(
  `${name}/addBookmark`,
  async (bookmark, { rejectWithValue }) => {
    try {
      const newBookmark = await apiClient.bookmarks.addBookmark(bookmark);
      NotificationManager.success(
        '',
        `Successfully saved ${bookmark.title}`,
        5000,
        () => {},
      );
      return newBookmark;
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Adding Map Error`,
        50000,
        () => {},
      );
      return rejectWithValue({
        message: `${status} ${message}`,
      });
    }
  },
);

/**
 * @type {import('@reduxjs/toolkit').AsyncThunk<
 *  import('typings').Bookmark,
 *  import('typings').Bookmark,
 *  {}
 * >}
 */
export const deleteBookmark = createAsyncThunk(
  `${name}/deleteBookmark`,
  async (bookmark, { rejectWithValue }) => {
    try {
      await apiClient.bookmarks.deleteBookmark(bookmark.id);
      NotificationManager.success(
        '',
        `Successfully deleted ${bookmark.title}`,
        5000,
        () => {},
      );
      return bookmark;
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Deleting Map Error`,
        50000,
        () => {},
      );

      return rejectWithValue({
        message: `${status} ${message}`,
      });
    }
  },
);

/** @type {BookmarksState} */
const initialState = {
  bookmarks: null,
  selectedBookmark: null,
  error: null,
  isLoading: false,
};

const bookmarkSlice = createSlice({
  name,
  initialState,
  reducers: {
    selectBookmark: (state, { payload }) => {
      if (payload !== state.selectedBookmark) {
        state.selectedBookmark = payload;
        state.isLoading = true;
      }
    },
    isLoaded: state => {
      state.isLoading = false;
      state.selectedBookmark = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchBookmarks.fulfilled, (state, { payload }) => {
      state.bookmarks = payload;
      state.error = null;
    });
    builder.addCase(fetchBookmarks.rejected, (state, { payload }) => {
      state.error = payload;
    });
    builder.addCase(addBookmark.fulfilled, (state, { payload }) => {
      state.bookmarks = state.bookmarks
        ? [payload, ...state.bookmarks]
        : [payload];
      state.error = null;
    });
    builder.addCase(addBookmark.rejected, (state, { payload }) => {
      state.error = payload;
    });
    builder.addCase(deleteBookmark.fulfilled, (state, { payload }) => {
      const filteredBookmarks = state.bookmarks.filter(
        bookmark => bookmark.id !== payload.id,
      );
      const isSelectedBookmark =
        state.selectedBookmark && state.selectedBookmark.id === payload.id;
      const selectedBookmark = isSelectedBookmark
        ? null
        : state.selectedBookmark;

      state.bookmarks = filteredBookmarks;
      state.selectedBookmark = selectedBookmark;
      state.error = null;
    });
    builder.addCase(deleteBookmark.rejected, (state, { payload }) => {
      state.error = payload;
    });
  },
});

export const { selectBookmark, isLoaded } = bookmarkSlice.actions;

/**
 * @returns {BookmarksState}
 */
export const baseSelector = state => state?.bookmarks;

export const bookmarksSelector = createSelector(
  baseSelector,
  bookmarks => bookmarks?.bookmarks,
);
export const selectedBookmarkSelector = createSelector(
  baseSelector,
  bookmarks => bookmarks?.selectedBookmark,
);
export const isLoadingSelector = createSelector(
  baseSelector,
  bookmarks => bookmarks?.isLoading || false,
);

export default bookmarkSlice.reducer;
