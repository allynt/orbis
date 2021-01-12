import React, { useState } from 'react';

import {
  Box,
  Typography,
  Button,
  Link,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { Link as RouterLink } from 'react-router-dom';

import { MAX_VISIBLE_BOOKMARKS } from '../landing-constants';

import { createLogo } from '../create-logo-helper';

import { ViewAllItems } from './view-all-items.component';
import { Items } from './items.component';

import { ReactComponent as OrbisLogoDark } from '../../../orbis-dark.svg';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#fff',
  },
  logo: {
    width: '10rem',
    color: '#787c82',
  },
  paragraph: {
    width: '100%',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(20),
  },
  button: {
    marginBottom: '1rem',
  },
}));

export const BookmarksLanding = ({ bookmarks, chooseBookmark }) => {
  const recentItems = bookmarks.slice(0, MAX_VISIBLE_BOOKMARKS);
  const [viewAllItems, setViewAllItems] = useState(false);
  const styles = useStyles();

  const toggle = () => setViewAllItems(!viewAllItems);

  return (
    // <Box
    //   className={styles.container}
    //   display="flex"
    //   flexDirection="column"
    //   justifyContent="space-around"
    //   alignItems="center"
    //   position="relative"
    //   minHeight="100%"
    //   width="100%"
    //   maxWidth="86rem"
    //   color="#101010"
    //   padding="0 2.5rem"
    // >
    //   <Box display="flex" width="100%">
    //     {createLogo(OrbisLogoDark)}
    //   </Box>

    viewAllItems ? (
      <ViewAllItems
        items={bookmarks}
        chooseBookmark={chooseBookmark}
        toggle={toggle}
      />
    ) : (
      <Box margin="1rem 0" width="100%">
        <Box display="flex" justifyContent="space-between" marginBottom="1rem">
          <Typography variant="h2" gutterBottom>
            Your Maps
          </Typography>
          {bookmarks.length > MAX_VISIBLE_BOOKMARKS && (
            <Link onClick={toggle}>View all</Link>
          )}
        </Box>
        <Items items={recentItems} chooseItem={chooseBookmark} />
      </Box>
    )

    // <Box
    //   display="flex"
    //   justifyContent="center"
    //   align-items="flex-start"
    //   height="5rem"
    // >
    //   <RouterLink to="/map">
    //     <Button className={styles.button} color="secondary">
    //       Browse Map
    //     </Button>
    //   </RouterLink>
    // </Box>
    // </Box>
  );
};
