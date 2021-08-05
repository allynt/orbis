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

import { Wrapper } from '../wrapper.component';

const useStyles = makeStyles(theme => ({
  back: {
    textDecoration: 'none',
  },
  button: { padding: '4px 5px' },
  icon: { transform: 'rotate(180deg)' },
  image: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(640),
    marginBlock: 'auto',
    objectFit: 'cover',
  },
}));

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 *  history: import('history').History
 *  match: import('react-router-dom').match<{orbId: string}>
 * }} props
 */
export const OrbDetails = ({ orbs, history, match }) => {
  const styles = useStyles();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const { orbId: id } = match.params;
  const orb = find(orbs, { id: +id });

  if (!orb) return null;

  return (
    <Wrapper>
      <Grid container spacing={mdUp ? 6 : 2}>
        <Grid item sm={6} container direction="column" spacing={smUp ? 8 : 2}>
          <Grid item>
            <Button
              // @ts-ignore
              role="link"
              classes={{ root: styles.button, startIcon: styles.icon }}
              startIcon={<PlayArrow />}
              variant="text"
              size="small"
              color="default"
              onClick={() => history.goBack()}
            >
              Back
            </Button>
          </Grid>
          <Grid item container>
            <img
              className={styles.image}
              src={orb.images?.[0]}
              alt={`${orb.name} Example`}
            />
          </Grid>
        </Grid>
        <Grid item sm={6} container direction="column" spacing={smUp ? 4 : 2}>
          <Grid item>
            <Typography
              style={{ fontWeight: 600, fontSize: '50px' }}
              variant="h1"
            >
              {orb.name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>{orb.description}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Wrapper>
  );
};
