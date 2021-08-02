import React from 'react';

import {
  Card,
  CardContent,
  makeStyles,
  Typography,
  Link,
} from '@astrosat/astrosat-ui';

import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.background.default,
  },
  cardContent: {
    textAlign: 'center',
  },
  logo: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(90),
    aspectRatio: '1/1',
    marginInline: 'auto',
    marginBlockEnd: theme.spacing(2),
  },
  description: {
    fontStyle: 'italic',
  },
}));

export const OrbCard = ({ orb }) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardContent classes={{ root: styles.cardContent }}>
        <img className={styles.logo} src={orb.logo} alt={`${orb.name} logo`} />
        <Typography variant="h2" gutterBottom>
          {orb.name}
        </Typography>
        <Typography className={styles.description} paragraph>
          {orb.shortDescription}
        </Typography>
        <Link
          // @ts-ignore
          component={RouterLink}
          to={`/orbs/${orb.id}`}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
};
