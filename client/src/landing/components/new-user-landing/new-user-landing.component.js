import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Box, Button, Typography, makeStyles } from '@astrosat/astrosat-ui';

import { createLogo } from '../create-logo-helper';

import backgroundImage from '../landing-image.png';
import { ReactComponent as OrbisLogoLight } from '../../../orbis-light.svg';

const useStyles = makeStyles(() => ({
  imageContainer: {
    backgroundColor: '#fff',
    backgroundImage: `url(${backgroundImage})`,
  },
}));

export const NewUserLanding = () => {
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

          <RouterLink to="/map">
            <Button color="secondary" data-testid="browse-map">
              Browse Map
            </Button>
          </RouterLink>
        </Box>
      </Box>
    </Box>
  );
};
