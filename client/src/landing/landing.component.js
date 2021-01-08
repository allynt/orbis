import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Link,
  Typography,
  makeStyles,
  styled,
} from '@astrosat/astrosat-ui';

import { Redirect, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { format } from 'date-fns';

import { DATE_FORMAT, MAX_VISIBLE_BOOKMARKS } from './landing-constants';

import {
  baseSelector,
  fetchBookmarks,
  selectBookmark,
} from '../bookmarks/bookmark.slice';

import newUserBackgroundImage from './landing-image.png';

import { ReactComponent as OrbisLogoLight } from '../orbis-light.svg';
import { ReactComponent as OrbisLogoDark } from '../orbis-dark.svg';

const useStyles = makeStyles(({ theme }) => ({
  container: {
    backgroundColor: '#fff',
  },
  imageContainer: {
    backgroundColor: '#fff',
    backgroundImage: `url(${newUserBackgroundImage})`,
  },
  logo: {
    width: '10rem',
    color: '#787c82',
  },
  itemImage: {
    height: '12rem',
    alignSelf: 'center',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    borderRadius: '1rem',
    overflow: 'hidden',
    opacity: '0.7',
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
  creationDate: {
    opacity: '0.5',
    fontSize: theme.typography.pxToRem(12),
    padding: '0.3rem 0',
    margin: '0',
  },
  paragraph: {
    width: '100%',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(20),
  },
}));

const createLogo = logo => {
  const Component = styled(logo)(({ theme }) => ({
    height: theme.typography.pxToRem(80),
    color: theme.palette.text.primary,
  }));

  return <Component />;
};

const ViewAllItems = ({ items, chooseBookmark, toggle }) => (
  <Box margin="1rem 0" width="100%">
    <Box display="flex" justifyContent="space-between" marginBottom="1rem">
      <Typography variant="h2" gutterBottom>
        View All
      </Typography>
      <Link onClick={toggle}>Back to menu</Link>
    </Box>
    <Items items={items} chooseItem={chooseBookmark} />
  </Box>
);

const Items = ({ items, chooseItem }) => {
  const [item, setItem] = useState(null);
  const styles = useStyles();

  if (item) {
    chooseItem(item);

    const viewport = { center: item.center, zoom: item.zoom };
    const queryString = encodeURI(JSON.stringify(viewport));
    return <Redirect to={`/map/${queryString}`} />;
  }
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      flexWrap="wrap"
      overflow="overlay"
      maxHeight="35rem"
    >
      {items.map(item => {
        const date = format(new Date(item.created), DATE_FORMAT);

        return (
          <Box key={item.title} width="17rem">
            <Box className={styles.itemImage} onClick={() => setItem(item)}>
              <picture>
                <img src={item.thumbnail} alt={item.title}></img>
              </picture>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              minHeight="1.5rem"
              padding="0.3rem 0"
            >
              <Box component="div">
                <Box
                  component="h3"
                  padding="0.3rem 0"
                  margin="0"
                  fontSize="inherit"
                  font-weight="inherit"
                >
                  {item.title}
                </Box>
                <Box component="p" className={styles.creationDate}>
                  {`Created ${date}`}
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const NewUserLanding = () => {
  const styles = useStyles();
  return (
    <Box
      className={styles.imageContainer}
      position="relative"
      height="100vh"
      width="100vw"
    >
      <Box position="absolute" top="1rem" left="8rem">
        {createLogo(OrbisLogoLight)}
      </Box>

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="center"
          marginRight="15rem"
          color="#fff"
        >
          <Box
            component="h1"
            fontSize="3.5rem"
            fontWeight="bold"
            marginBottom="2rem"
          >
            ORBIS JOURNEY
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            minHeight="4rem"
            marginBottom="2rem"
          >
            <Typography variant="subtitle1" className={styles.paragraph}>
              Your Earth Observation journey starts here
            </Typography>
            <Typography variant="subtitle1" className={styles.paragraph}>
              Click Browse Map below to start
            </Typography>
          </Box>

          <Link href="/map">
            <Button data-testid="browse-map">Browse Map</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

const ExistingUserLanding = ({ bookmarks, chooseBookmark }) => {
  const recentItems = bookmarks.slice(0, MAX_VISIBLE_BOOKMARKS);
  const [viewAllItems, setViewAllItems] = useState(false);
  const styles = useStyles();

  const toggle = () => setViewAllItems(!viewAllItems);

  return (
    <Box
      className={styles.container}
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      position="relative"
      minHeight="100%"
      width="100%"
      maxWidth="86rem"
      color="#101010"
      padding="0 2.5rem"
    >
      <Box display="flex" width="100%">
        {createLogo(OrbisLogoDark)}
      </Box>

      {viewAllItems ? (
        <ViewAllItems
          items={bookmarks}
          chooseBookmark={chooseBookmark}
          toggle={toggle}
        />
      ) : (
        <Box margin="1rem 0" width="100%">
          <Box
            display="flex"
            justifyContent="space-between"
            marginBottom="1rem"
          >
            <Typography variant="h2" gutterBottom>
              Your Maps
            </Typography>
            {bookmarks.length > MAX_VISIBLE_BOOKMARKS && (
              <Link onClick={toggle}>View all</Link>
            )}
          </Box>
          <Items items={recentItems} chooseItem={chooseBookmark} />
        </Box>
      )}

      <Box
        display="flex"
        justifyContent="center"
        align-items="flex-start"
        height="5rem"
      >
        <RouterLink to="/map">
          <Button>Browse Map</Button>
        </RouterLink>
      </Box>
    </Box>
  );
};

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
        <NewUserLanding />
      )}
    </Box>
  );
};

Landing.propTypes = {};

export default Landing;
