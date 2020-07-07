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

const BookmarksPanel = ({ map }) => {
  const dispatch = useDispatch();
  const owner = useSelector(state => state.accounts.user.id);

  const submit = form => {
    const drawCtrl = map._controls.find(ctrl => ctrl.changeMode);
    const featureCollection = drawCtrl.getAll();

    const { lng, lat } = map.getCenter();

    map.getCanvas().toBlob(blob => {
      dispatch(
        addBookmark(
          {
            ...form,
            feature_collection: featureCollection,
            center: [lng, lat],
            zoom: map.getZoom(),
            owner,
            thumbnail: blob,
          },
          'image/png',
        ),
      );
    });
  };

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));
  const deleteBookmarkItem = bookmark => dispatch(deleteBookmark(bookmark));

  const bookmarks = useSelector(state => state.bookmarks.bookmarks);
  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  return (
    <div className={styles.container}>
      <BookmarkForm
        bookmarkTitles={bookmarks.map(b => b.title.toLowerCase())}
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
