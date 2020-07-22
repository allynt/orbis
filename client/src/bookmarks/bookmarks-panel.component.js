import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BookmarkForm from './bookmark-form.component';
import BookmarkList from './bookmarks-list.component';

import {
  fetchBookmarks,
  addBookmark,
  selectBookmark,
  deleteBookmark,
} from './bookmark.slice';

import styles from '../side-menu/side-menu.module.css';
import { userSelector } from 'accounts/accounts.slice';
import { useMap } from 'MapContext';
import { viewportSelector } from 'map/map.slice';
import { activeLayersSelector } from 'data-layers/data-layers.slice';

const BookmarksPanel = () => {
  const { createScreenshot } = useMap();
  const viewState = useSelector(viewportSelector);
  const layers = useSelector(activeLayersSelector);
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const submit = form => {
    createScreenshot(thumbnail => {
      dispatch(
        addBookmark({
          ...form,
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          owner: user.id,
          thumbnail,
          layers: Object.keys(layers),
        }),
      );
    });
  };

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));
  const deleteBookmarkItem = bookmark => dispatch(deleteBookmark(bookmark));

  const bookmarks = useSelector(state => state?.bookmarks?.bookmarks);

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  return (
    <div className={styles.container}>
      <BookmarkForm
        bookmarkTitles={bookmarks?.map(b => b?.title?.toLowerCase())}
        submit={submit}
      />
      <BookmarkList
        bookmarks={bookmarks}
        selectBookmark={chooseBookmark}
        deleteBookmark={deleteBookmarkItem}
      />
    </div>
  );
};

export default BookmarksPanel;
