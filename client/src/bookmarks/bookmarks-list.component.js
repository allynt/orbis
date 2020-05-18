import React from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import styles from './bookmarks-panel.module.css';

const BookmarkList = ({ bookmarks, selectBookmark, deleteBookmark }) => (
  <div>
    {bookmarks && bookmarks.length > 0 ? (
      <ul className={styles.bookmarkList}>
        {bookmarks.map(bookmark => {
          return (
            <li key={bookmark.title} className={styles.bookmark}>
              <div className={styles.bookmarkThumbnail}>
                <picture>
                  <source srcSet={bookmark.thumbnail} />
                  <img src={bookmark.thumbnail} alt={bookmark.title} />
                </picture>
              </div>
              <div className={styles.bookmarkContent}>
                <h3 className={styles.bookmarkTitle}>{bookmark.title}</h3>
                <p className={styles.bookmarkDescription}>{bookmark.description || ''}</p>
                <div className={styles.bookmarkButtons}>
                  <Button classNames={[styles.bookmarkButton]} onClick={() => selectBookmark(bookmark)}>
                    Load
                  </Button>
                  <Button
                    theme="tertiary"
                    classNames={[styles.bookmarkButton]}
                    onClick={() => deleteBookmark(bookmark)}
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

BookmarkList.propTypes = {
  bookmarks: PropTypes.array,
  selectBookmark: PropTypes.func.isRequired,
  deleteBookmark: PropTypes.func.isRequired,
};

export default BookmarkList;
