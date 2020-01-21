import React from 'react';
import styles from './landing.module.css';

const LandingBookmarks = ({ bookmarks }) => {
  const dummyDate = 'Created 27 Nov 2019';

  return (
    <div className={styles.items}>
      {bookmarks &&
        bookmarks.map(bookmark => {
          return (
            <div className={styles.item}>
              <div className={styles.imageContainer}>
                <img src={bookmark.thumbnail} className={styles.image} alt={bookmark.title}></img>
              </div>

              <div className={styles.infoContainer}>
                <div>
                  <h3 className={styles.title}>{bookmark.title}</h3>
                  <p className={styles.creationDate}>{dummyDate}</p>
                </div>
                <div className={styles.ellipsis}>...</div>
              </div>
            </div>
          );
        })}
      <div>
        <div className={styles.createNew}>+</div>
        <div className={styles.new}>
          <h3>New</h3>
        </div>
      </div>
    </div>
  );
};

export default LandingBookmarks;
