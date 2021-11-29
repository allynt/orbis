import React, { useEffect } from 'react';

import {
  Button,
  Container,
  Fade,
  makeStyles,
  ThemeProvider,
  useMediaQuery,
} from '@astrosat/astrosat-ui';

import { push } from 'connected-react-router';
import ProgressiveImage from 'react-progressive-image-loading';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { OrbisLogo } from 'components';
import {
  dataSourcesSelector,
  fetchSources,
  dashboardSourcesSelector,
} from 'data-layers/data-layers.slice';
import { useMap } from 'MapContext';

import {
  bookmarksSelector,
  fetchBookmarks,
  selectBookmark,
} from '../bookmarks/bookmarks.slice';
import { ContentLanding } from './content-landing/content-landing.component';
import backgroundImagePlaceholder from './landing-image-placeholder.png';
import backgroundImage from './landing-image.png';
import { NoContentLanding } from './no-content-landing/no-content-landing.component';

const useStyles = makeStyles(theme => ({
  page: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: props =>
      props.hasContent ? theme.palette.common.white : 'transparent',
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
    width: props => (props.hasContent ? '100%' : 'max-content'),
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
  const dashboardSources = useSelector(dashboardSourcesSelector);
  const sources = useSelector(dataSourcesSelector);

  const hasContent = bookmarks?.length > 0 || dashboardSources?.length > 0;
  const styles = useStyles({ hasContent });
  const { setViewState, viewState } = useMap();

  /**
   * @param {import('typings').Bookmark} bookmark
   */
  const chooseBookmark = bookmark => {
    dispatch(selectBookmark({ bookmark, setViewState, viewState }));
  };

  const chooseDashboard = dashboard =>
    dispatch(push(`/dashboard?source_id=${dashboard.source_id}`));

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

  const dashboards = dashboardSources.length
    ? dashboardSources.map(source => {
        const metadata =
          source?.metadata?.application?.orbis?.dashboard_component;
        return {
          source_id: source?.source_id,
          title: metadata?.title,
          thumbnail: `/images/dashboard/${metadata.name}.png`,
        };
      })
    : null;
  return (
    <ThemeProvider theme={hasContent ? 'light' : 'dark'}>
      <div className={styles.page}>
        <ProgressiveImage
          preview={backgroundImagePlaceholder}
          src={backgroundImage}
          render={(src, style) => (
            <Fade in={!hasContent}>
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
            {hasContent ? (
              <ContentLanding
                bookmarks={bookmarks}
                chooseBookmark={chooseBookmark}
                dashboards={dashboards}
                chooseDashboard={chooseDashboard}
              />
            ) : (
              <NoContentLanding />
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
