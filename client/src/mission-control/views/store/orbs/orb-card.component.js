import React from 'react';

import {
  Card,
  CardContent,
  makeStyles,
  Typography,
  Link,
} from '@astrosat/astrosat-ui';

import { Link as RouterLink, useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
  cardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(90),
    marginBlockEnd: theme.spacing(2),
  },
  description: {
    fontStyle: 'italic',
  },
  link: {
    marginTop: 'auto',
  },
}));

/**
 * @param {{orb: import('typings').Orb}} props
 */
export const OrbCard = ({ orb }) => {
  const { url } = useRouteMatch();
  const styles = useStyles();
  const { id, name, shortDescription, logo } = orb;

  return (
    <Card className={styles.card}>
      <CardContent classes={{ root: styles.cardContent }}>
        <img className={styles.logo} src={logo} alt={`${name} logo`} />
        <Typography variant="h2" gutterBottom>
          {name}
        </Typography>
        {shortDescription && (
          <Typography className={styles.description} paragraph>
            {shortDescription}
          </Typography>
        )}
        <Link
          className={styles.link}
          // @ts-ignore
          component={RouterLink}
          to={`${url}/${id}`}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
};
