import React from 'react';

import {
  Card,
  CardContent,
  makeStyles,
  Typography,
  Link,
  Skeleton,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: theme.typography.pxToRem(425),
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
    textAlign: 'center',
  },
  link: {
    marginTop: 'auto',
  },
  noLogo: {},
}));

/**
 * @param {{orb: import('typings').Orb, style?: React.CSSProperties}} props
 */
export const OrbCard = ({ orb, style }) => {
  const { url } = useRouteMatch();
  const styles = useStyles();
  const { id, name, short_description: shortDescription, logo } = orb;

  return (
    <Card className={styles.card} style={style}>
      <CardContent classes={{ root: styles.cardContent }}>
        {logo && (
          <img
            alt={`${name} logo`}
            className={styles.logo}
            src={`data:image/svg+xml;base64,${logo}`}
          />
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
          to={location => ({ ...location, pathname: `${url}/${id}` })}
        >
          Learn more about this Orb
        </Link>
      </CardContent>
    </Card>
  );
};

export const OrbCardSkeleton = () => {
  const styles = useStyles();

  return (
    <Card className={styles.card} elevation={0}>
      <CardContent classes={{ root: styles.cardContent }}>
        <Skeleton
          variant="circle"
          width={90}
          height={90}
          className={styles.logo}
        />
        <Typography variant="h2" gutterBottom className={styles.name}>
          <Skeleton width="15ch" />
        </Typography>
        <Typography paragraph>
          <Skeleton width="22ch" />
        </Typography>
        <div className={styles.link}>
          <Skeleton width="10ch" />
        </div>
      </CardContent>
    </Card>
  );
};
