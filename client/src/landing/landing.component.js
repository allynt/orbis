import React, { useEffect } from 'react';

import {
  Button,
  Container,
  Fade,
  makeStyles,
  ThemeProvider,
  useMediaQuery,
} from '@astrosat/astrosat-ui';

import ProgressiveImage from 'react-progressive-image-loading';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { OrbisLogo } from 'components';
import {
  dataSourcesSelector,
  fetchSources,
} from 'data-layers/data-layers.slice';
import { useMap } from 'MapContext';

import {
  bookmarksSelector,
  fetchBookmarks,
  selectBookmark,
} from '../bookmarks/bookmarks.slice';
import { BookmarksLanding } from './bookmarks-landing/bookmarks-landing.component';
import backgroundImagePlaceholder from './landing-image-placeholder.png';
import backgroundImage from './landing-image.png';
import { NoBookmarksLanding } from './no-bookmarks-landing/no-bookmarks-landing.component';

const useStyles = makeStyles(theme => ({
  page: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: props =>
      props.hasBookmarks ? theme.palette.common.white : 'transparent',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
  },
  container: {
    zIndex: 1,
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
    zIndex: 2,
  },
  logo: {
    zIndex: 2,
    height: theme.typography.pxToRem(80),
  },
  link: {
    marginTop: theme.spacing(4.5),
    textDecoration: 'none',
  },
}));

const Landing = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const greaterThan1920 = useMediaQuery(theme => theme?.breakpoints?.up(1921));
  const bookmarks = useSelector(bookmarksSelector);
  const sources = useSelector(dataSourcesSelector);
  const hasBookmarks = bookmarks?.length > 0;
  const styles = useStyles({ hasBookmarks });
  const { setViewState, viewState } = useMap();

  /**
   * @param {import('typings').Bookmark} bookmark
   */
  const chooseBookmark = bookmark => {
    dispatch(selectBookmark({ bookmark, setViewState, viewState }));
  };

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  useEffect(() => {
    if (!sources || sources.length === 0) {
      dispatch(fetchSources());
    }
  }, [dispatch, sources]);

  return (
    <ThemeProvider theme={hasBookmarks ? 'light' : 'dark'}>
      <div className={styles.page}>
        <ProgressiveImage
          preview={backgroundImagePlaceholder}
          src={backgroundImage}
          render={(src, style) => (
            <Fade in={!hasBookmarks}>
              <div
                className={styles.background}
                style={{
                  ...style,
                  backgroundImage: `url(${src})`,
                }}
              />
            </Fade>
          )}
        />

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
            <RouterLink
              className={styles.link}
              to="/dashboard?source_id=astrosat/demo/rice_vector/v3"
            >
              <Button color="secondary">Waltham Forest Dashboard</Button>
            </RouterLink>
            <RouterLink
              className={styles.link}
              to="/dashboard?source_id=astrosat/demo/air_pollution/v2"
            >
              <Button color="secondary">Nature Scotland Dashboard</Button>
            </RouterLink>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Landing;
