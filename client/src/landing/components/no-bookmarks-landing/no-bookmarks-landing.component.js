import React from 'react';

import { Typography, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: theme.typography.pxToRem(58),
    fontWeight: 600,
    marginBottom: theme.spacing(4.5),
  },
  subtitle: {
    fontWeight: 500,
  },
}));

export const NoBookmarksLanding = () => {
  const styles = useStyles();
  return (
    <>
      <Typography variant="h1" className={styles.title}>
        ORBIS JOURNEY
      </Typography>
      <Typography variant="h2" className={styles.subtitle} paragraph>
        Your Earth Observation journey starts here
      </Typography>
      <Typography variant="h2" className={styles.subtitle}>
        Click Browse Map below to start
      </Typography>
    </>
  );
};
