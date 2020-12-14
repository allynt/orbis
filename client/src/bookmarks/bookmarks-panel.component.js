import { userSelector } from 'accounts/accounts.selectors';
import { activeLayersSelector } from 'data-layers/data-layers.slice';
import { useMap } from 'MapContext';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../side-menu/control-panel.module.css';
import BookmarkForm from './bookmark-form.component';
import {
  addBookmark,
  deleteBookmark,
  fetchBookmarks,
  selectBookmark,
} from './bookmark.slice';
import BookmarkList from './bookmarks-list.component';

const BookmarksPanel = () => {
  const { createScreenshot, viewState } = useMap();
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
          layers,
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
