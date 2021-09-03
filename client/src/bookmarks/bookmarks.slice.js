import { FlyToInterpolator } from '@deck.gl/core';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';
import {
  dataSourcesSelector,
  fetchSourcesSuccess,
  updateLayers,
} from 'data-layers/data-layers.slice';
import { setFeatures as setDrawingToolsFeatures } from 'drawing-tools/drawing-tools.slice';
import { setState as setLayersState } from 'map/orbs/layers.slice';

/**
 * @typedef BookmarksState
 * @property {import('typings').Bookmark[]} [bookmarks]
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

export const selectBookmark = createAsyncThunk(
  `${name}/selectBookmark`,
  /**
   * @type {import('@reduxjs/toolkit').AsyncThunkPayloadCreator<
   *  void,
   *  {
   *    bookmark: import('typings').Bookmark
   *    viewState: import('MapContext').ViewState
   *    setViewState: React.Dispatch<import('MapContext').ViewState>
   *  },
   *  {rejectValue: string[], state: import('react-redux').DefaultRootState}
   * >}
   */
  async ({ bookmark, setViewState, viewState }, { dispatch, getState }) => {
    const presentSources = dataSourcesSelector(getState());
    if (!presentSources || presentSources.length === 0) {
      const fetchedSources = await apiClient.data.getSources();
      dispatch(fetchSourcesSuccess(fetchedSources));
    }
    const {
      center: [longitude, latitude],
      zoom,
      layers,
      orbs,
      drawn_feature_collection,
    } = bookmark;
    setViewState({
      ...viewState,
      longitude,
      latitude,
      zoom,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
    dispatch(updateLayers(layers || []));
    dispatch(setLayersState(orbs?.layers));
    dispatch(setDrawingToolsFeatures(drawn_feature_collection));
    dispatch(push('/map'));
  },
);

/** @type {BookmarksState} */
const initialState = {
  bookmarks: null,
  error: null,
  isLoading: false,
};

const bookmarkSlice = createSlice({
  name,
  initialState,
  reducers: {},
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

      state.bookmarks = filteredBookmarks;
      state.error = null;
    });
    builder.addCase(deleteBookmark.rejected, (state, { payload }) => {
      state.error = payload;
    });
    builder
      .addCase(selectBookmark.pending, state => {
        state.isLoading = true;
      })
      .addCase(selectBookmark.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(selectBookmark.rejected, state => {
        state.isLoading = false;
      });
  },
});

/**
 * @param {import('typings').RootState} state
 */
export const baseSelector = state => state?.bookmarks;

export const bookmarksSelector = createSelector(
  baseSelector,
  bookmarks => bookmarks?.bookmarks,
);
export const isLoadingSelector = createSelector(
  baseSelector,
  bookmarks => bookmarks?.isLoading || false,
);

export default bookmarkSlice.reducer;
