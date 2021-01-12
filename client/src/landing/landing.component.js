import React, { useEffect } from 'react';

import {
  Box,
  Button,
  Container,
  makeStyles,
  ThemeProvider,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { OrbisLogo } from 'components';
import {
  bookmarksSelector,
  fetchBookmarks,
  selectBookmark,
} from '../bookmarks/bookmarks.slice';
import { BookmarksLanding, NoBookmarksLanding } from './components';
import backgroundImage from './components/landing-image.png';

const useStyles = makeStyles(theme => ({
  background: {
    width: '100vw',
    height: '100vh',
    background: props =>
      props.hasBookmarks
        ? theme.palette.common.white
        : `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'min-content 1fr',
  },
  content: {
    justifySelf: props => (props.hasBookmarks ? 'center' : 'end'),
    alignSelf: 'center',
    textAlign: 'center',
  },
  logo: {
    height: theme.typography.pxToRem(80),
  },
  link: {
    marginTop: theme.spacing(4.5),
  },
}));

const Landing = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(bookmarksSelector);
  const hasBookmarks = bookmarks?.length > 0;
  const styles = useStyles({ hasBookmarks });

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  return (
    <ThemeProvider theme={hasBookmarks ? 'light' : 'dark'}>
      <Box className={styles.background}>
        <Container className={styles.container} maxWidth="lg">
          <OrbisLogo className={styles.logo} />
          <Box className={styles.content}>
            {hasBookmarks ? (
              <BookmarksLanding
                bookmarks={bookmarks}
                chooseBookmark={chooseBookmark}
              />
            ) : (
              <NoBookmarksLanding />
            )}
            <Link
              className={styles.link}
              to="/map"
              component={Button}
              color="secondary"
            >
              Browse Map
            </Link>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

Landing.propTypes = {};

export default Landing;
