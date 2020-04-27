import { NotificationManager } from 'react-notifications';

import { createSlice } from '@reduxjs/toolkit';

import { getData, sendData, getJsonAuthHeaders, getFormAuthHeaders } from '../utils/http';

const API = {
  fetch: '/api/bookmarks/',
  add: '/api/bookmarks/',
  delete: '/api/bookmarks/',
};

const initialState = {
  bookmarks: null,
  selectedBookmark: null,
  error: null,
  isLoading: false,
};

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    fetchBookmarksSuccess: (state, { payload }) => {
      state.bookmarks = payload;
      state.error = null;
    },
    fetchBookmarksFailure: (state, { payload }) => {
      state.error = payload;
    },
    addBookmarkSuccess: (state, { payload }) => {
      state.bookmarks = state.bookmarks ? [...state.bookmarks, payload] : [payload];
      state.selectedBookmark = payload;
      state.error = null;
    },
    addBookmarkFailure: (state, { payload }) => {
      state.error = payload;
    },
    deleteBookmarkSuccess: (state, { payload }) => {
      const filteredBookmarks = state.bookmarks.filter(bookmark => bookmark.id !== payload.id);
      const isSelectedBookmark = state.selectedBookmark && state.selectedBookmark.id === payload.id;
      const selectedBookmark = isSelectedBookmark ? null : state.selectedBookmark;

      state.bookmarks = filteredBookmarks;
      state.selectedBookmark = selectedBookmark;
      state.error = null;
    },
    deleteBookmarkFailure: (state, { payload }) => {
      state.error = payload;
    },
    selectBookmark: (state, { payload }) => {
      if (payload !== state.selectedBookmark) {
        state.selectedBookmark = payload;
        state.isLoading = true;
      }
    },
    isLoaded: state => {
      state.isLoading = false;
    },
  },
});

export const {
  fetchBookmarksSuccess,
  fetchBookmarksFailure,
  addBookmarkSuccess,
  addBookmarkFailure,
  deleteBookmarkSuccess,
  deleteBookmarkFailure,
  selectBookmark,
  isLoaded,
} = bookmarkSlice.actions;

export const fetchBookmarks = () => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await getData(API.fetch, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Bookmark Error - ${response.statusText}`, 50000, () => {});

    return dispatch(fetchBookmarksFailure({ message }));
  }

  const bookmarks = await response.json();

  return dispatch(fetchBookmarksSuccess(bookmarks));
};

export const addBookmark = bookmark => async (dispatch, getState) => {
  const formData = new FormData();
  Object.keys(bookmark).forEach(key => formData.append(key, bookmark[key]));
  // nested JSON should be stringified prior to passing to backend
  formData.set('center', JSON.stringify(bookmark['center']));
  formData.set('feature_collection', JSON.stringify(bookmark['feature_collection']));

  const headers = getFormAuthHeaders(getState());

  const response = await sendData(API.add, formData, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Adding Bookmark Error - ${response.statusText}`, 50000, () => {});

    return dispatch(addBookmarkFailure({ message }));
  }

  const newBookmark = await response.json();
  NotificationManager.success('Successfully bookmarked map', 'Successful map bookmarking', 5000, () => {});

  return dispatch(addBookmarkSuccess(newBookmark));
};

export const deleteBookmark = bookmark => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(API.delete, bookmark.id, headers, 'DELETE');

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Deleting Bookmark Error - ${response.statusText}`, 50000, () => {});

    return dispatch(deleteBookmarkFailure({ message }));
  }

  NotificationManager.success('Successfully deleted bookmark', 'Successful bookmark deletion', 5000, () => {});

  return dispatch(deleteBookmarkSuccess(bookmark));
};

export default bookmarkSlice.reducer;