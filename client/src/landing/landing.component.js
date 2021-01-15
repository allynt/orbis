import React, { useEffect } from 'react';

import {
  Button,
  Container,
  makeStyles,
  ThemeProvider,
  useMediaQuery,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { OrbisLogo } from 'components';
import {
  bookmarksSelector,
  fetchBookmarks,
  selectBookmark,
} from '../bookmarks/bookmarks.slice';
import { BookmarksLanding } from './bookmarks-landing/bookmarks-landing.component';
import backgroundImage from './landing-image.png';
import { NoBookmarksLanding } from './no-bookmarks-landing/no-bookmarks-landing.component';

const useStyles = makeStyles(theme => ({
  background: {
    width: '100vw',
    height: '100vh',
    backgroundImage: props =>
      props.hasBookmarks ? '' : `url(${backgroundImage})`,
    backgroundColor: props =>
      props.hasBookmarks ? theme.palette.common.white : '',
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    overflow: 'hidden',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'min-content 1fr',
    overflowY: 'auto',
  },
  content: {
    width: props => (props.hasBookmarks ? '100%' : 'max-content'),
    justifySelf: 'end',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    height: theme.typography.pxToRem(80),
  },
  link: {
    marginTop: theme.spacing(4.5),
    textDecoration: 'none',
  },
}));

const Landing = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const greaterThan1920 = useMediaQuery(theme => theme?.breakpoints?.up(1921));
  const bookmarks = useSelector(bookmarksSelector);
  const hasBookmarks = bookmarks?.length > 0;
  const styles = useStyles({ hasBookmarks });

  /**
   * @param {import('typings/orbis').Bookmark} bookmark
   */
  const chooseBookmark = bookmark => {
    dispatch(selectBookmark(bookmark));
    history.push('/map');
  };

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  return (
    <ThemeProvider theme={hasBookmarks ? 'light' : 'dark'}>
      <div className={styles.background}>
        <Container
          className={styles.container}
          maxWidth={greaterThan1920 ? 'xl' : 'lg'}
        >
          <OrbisLogo className={styles.logo} titleAccess="Orbis Logo" />
          <div className={styles.content}>
            {hasBookmarks ? (
              <BookmarksLanding
                bookmarks={bookmarks}
                chooseBookmark={chooseBookmark}
              />
            ) : (
              <NoBookmarksLanding />
            )}
            <RouterLink className={styles.link} to="/map">
              <Button color="secondary">Browse Map</Button>
            </RouterLink>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Landing;
