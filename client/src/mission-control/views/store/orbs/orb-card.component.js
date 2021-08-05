import React from 'react';

import {
  Card,
  CardContent,
  makeStyles,
  Typography,
  Link,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2,
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
  name: {
    '&$noLogo': {
      marginBlockStart: `calc(${theme.typography.pxToRem(90)} + ${theme.spacing(
        2,
      )})`,
    },
  },
  description: {
    fontStyle: 'italic',
  },
  link: {
    marginTop: 'auto',
  },
  noLogo: {},
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
        {logo && (
          <img className={styles.logo} src={logo} alt={`${name} logo`} />
        )}
        <Typography
          className={clsx(styles.name, { [styles.noLogo]: !logo })}
          variant="h2"
          gutterBottom
        >
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
