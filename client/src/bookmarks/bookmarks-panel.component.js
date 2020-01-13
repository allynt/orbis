import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BookmarkForm from './bookmark-form.component';
import BookmarkList from './bookmarks-list.component';

import { fetchBookmarks, addBookmark, selectBookmark } from './bookmarks.actions';

import styles from './bookmarks-panel.module.css';

const BookmarksPanel = ({ map }) => {
  const dispatch = useDispatch();
  const owner = useSelector(state => state.accounts.user.id);
  const reader = new FileReader();

  const submit = form => {
    const drawCtrl = map._controls.find(ctrl => ctrl.changeMode);
    const featureCollection = drawCtrl.getAll();

    const { lng, lat } = map.getCenter();

    // Some explanation about the 2 functions below:
    // FileReader comes with am in-built function that converts blobs into Base64 strings (line 43)
    // This is given to us in the render.onload function as the 'result' property.
    // However, we only get it when it isfinished loading, hwence why the dispatch function is inside the onload.
    // I have tried everything I can think of to post this Base64 string, but it appears it is too large a payload to send.

    reader.onload = () => {
      console.log(reader.result);
      dispatch(
        addBookmark({
          ...form,
          feature_collection: featureCollection,
          center: [lng, lat],
          zoom: map.getZoom(),
          owner,
          image: reader.result
        })
      );
    };

    map.getCanvas().toBlob(blob => {
      reader.readAsDataURL(blob);
    });
  };

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));

  const bookmarks = useSelector(state => state.bookmarks.bookmarks);

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  return (
    <div className={styles.panel}>
      <BookmarkForm submit={submit} />
      <BookmarkList bookmarks={bookmarks} selectBookmark={chooseBookmark} />
    </div>
  );
};

export default BookmarksPanel;
