import React from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  Typography,
  makeStyles,
  Container,
} from '@astrosat/astrosat-ui';

import { createLogo } from '../create-logo-helper';

import backgroundImage from '../landing-image.png';
import { ReactComponent as OrbisLogoLight } from '../../../orbis-light.svg';
import { OrbisLogo } from 'components';

const useStyles = makeStyles(theme => ({
  background: {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
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
  title: {
    fontSize: theme.typography.pxToRem(58),
    fontWeight: 600,
    marginBottom: theme.spacing(4.5),
  },
  subtitle: {
    fontWeight: 500,
  },
  link: {
    marginTop: theme.spacing(4.5),
  },
  logo: {
    height: theme.typography.pxToRem(80),
  },
}));

export const NewUserLanding = () => {
  const styles = useStyles();
  return (
    <Box className={styles.background}>
      <Container className={styles.container} maxWidth="lg">
        <OrbisLogo className={styles.logo} />
        <Box justifySelf="end" alignSelf="center" textAlign="center">
          <Typography variant="h1" className={styles.title}>
            ORBIS JOURNEY
          </Typography>
          <Typography variant="h2" className={styles.subtitle} paragraph>
            Your Earth Observation journey starts here
          </Typography>
          <Typography variant="h2" className={styles.subtitle}>
            Click Browse Map below to start
          </Typography>
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
  );
};
