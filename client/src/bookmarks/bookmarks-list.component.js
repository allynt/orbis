import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import { deleteBookmark } from './bookmarks.actions';

import styles from './bookmarks-panel.module.css';

const BookmarkList = ({ bookmarks, selectBookmark }) => {
  const dispatch = useDispatch();

  return (
    <div>
      {bookmarks && bookmarks.length > 0 ? (
        <ul className={styles.bookmarkList}>
          {bookmarks.map(bookmark => {
            return (
              <li key={bookmark.title} className={styles.bookmark}>
                <div className={styles.bookmarkThumbnail}>Thumb</div>
                <div className={styles.bookmarkContent}>
                  <h3 className={styles.bookmarkTitle}>Title goes here</h3>
                  <p className={styles.bookmarkDescription}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                  <div className={styles.bookmarkButtons}>
                    <Button classNames={[styles.bookmarkButton]} onClick={() => selectBookmark(bookmark)}>
                      Load
                    </Button>
                    <Button
                      theme="tertiary"
                      classNames={[styles.bookmarkButton]}
                      onClick={() => {
                        dispatch(deleteBookmark(bookmark));
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.noBookmarks}>No Bookmarks</p>
      )}
    </div>
  );
};

BookmarkList.propTypes = {
  bookmarks: PropTypes.array,
  selectBookmark: PropTypes.func.isRequired
};

export default BookmarkList;
