import React from 'react';

import {
  Card,
  CardContent,
  ImageList,
  ImageListItem,
  Link,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
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

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 * }} props
 */
export const Orbs = ({ orbs }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const xsDown = useMediaQuery(theme.breakpoints.down('xs'));
  const styles = useStyles();

  let cols = 3;
  if (smDown) cols = 2;
  if (xsDown) cols = 1;

  return (
    <ImageList cols={cols} gap={16} rowHeight="auto">
      {orbs.map(orb => (
        <ImageListItem key={orb.id}>
          <Card>
            <CardContent classes={{ root: styles.cardContent }}>
              <img
                className={styles.logo}
                src={orb.logo}
                alt={`${orb.name} logo`}
              />
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
        </ImageListItem>
      ))}
    </ImageList>
  );
};
