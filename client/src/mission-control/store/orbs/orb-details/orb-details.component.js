import React from 'react';

import {
  Button,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { PlayArrow } from '@material-ui/icons';
import { find } from 'lodash';
import { Link as RouterLink, useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  back: {
    textDecoration: 'none',
  },
  button: { padding: '4px 5px' },
  icon: { transform: 'rotate(180deg)' },
  image: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(640),
    margin: '0 auto',
    objectFit: 'cover',
  },
}));

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 * }} props
 */
export const OrbDetails = ({ orbs }) => {
  const styles = useStyles();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('sm'));

  /** @type {{id: string}} */
  const { id } = useParams();
  const orb = find(orbs, { id: +id });

  if (!orb) return null;

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} container direction="column" spacing={mdUp ? 6 : 2}>
        <Grid item>
          <RouterLink className={styles.back} to="/orbs">
            <Button
              // @ts-ignore
              component="span"
              classes={{ root: styles.button, startIcon: styles.icon }}
              startIcon={<PlayArrow />}
              variant="text"
              size="small"
              color="default"
            >
              Back
            </Button>
          </RouterLink>
        </Grid>
        <Grid item container>
          <img
            className={styles.image}
            src={orb.images[0]}
            alt={`${orb.name} Example`}
          />
        </Grid>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="h1" gutterBottom>
          {orb.name}
        </Typography>
        <Typography>{orb.description}</Typography>
      </Grid>
    </Grid>
  );
};
