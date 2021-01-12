import React, { useEffect } from 'react';

import { Box, makeStyles } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { NoBookmarksLanding, ExistingUserLanding } from './components';

import {
  baseSelector,
  fetchBookmarks,
  selectBookmark,
} from '../bookmarks/bookmarks.slice';

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: '#fff',
  },
}));

const Landing = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(baseSelector)?.bookmarks;
  const styles = useStyles();

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  return (
    <Box
      className={styles.container}
      display="flex"
      justifyContent="center"
      height="100%"
      minWidth="75%"
    >
      {bookmarks?.length > 0 ? (
        <ExistingUserLanding
          bookmarks={bookmarks}
          chooseBookmark={chooseBookmark}
        />
      ) : (
        <NoBookmarksLanding />
      )}
    </Box>
  );
};

Landing.propTypes = {};

export default Landing;
