import React from 'react';

import {
  Button,
  CorrectIcon,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@astrosat/astrosat-ui';

import { find } from 'lodash';
import { Link } from 'react-router-dom';

import { Wrapper } from '../../../shared-components/wrapper.component';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: '0 auto',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4, 3, 3),
    maxWidth: '50rem',
  },
  iconGrid: { display: 'grid', placeItems: 'center' },
  icon: {
    fontSize: '5rem',
    color: theme.palette.success.main,
  },
  textGrid: { textAlign: 'center' },
  link: {
    textDecoration: 'none',
  },
}));

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 *  location: import('history').Location
 * }} props
 */
export const Completion = ({ orbs, location }) => {
  const styles = useStyles();
  const searchParams = new URLSearchParams(location.search);
  const orb = find(orbs, { id: +searchParams.get('orbId') });
  const users = +searchParams.get('users');

  return (
    <Wrapper title="Your Order">
      <Paper className={styles.paper}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item sm={4} className={styles.iconGrid}>
            <CorrectIcon className={styles.icon} />
          </Grid>
          <Grid item sm={8} className={styles.textGrid}>
            <Typography variant="h2" component="h1" gutterBottom>
              Your order for {orb.name} was successful for {users}{' '}
              {users === 1 ? 'User' : 'Users'}!
            </Typography>
            <Typography paragraph>
              Now You can create and invite your Users by clicking the “Take me
              to Users” shortcut now or anytime later under the Users tab.
            </Typography>
            <Typography component="p" variant="h2" paragraph>
              Godspeed!
            </Typography>
            <Link className={styles.link} to="/mission-control/users">
              <Button>Take me to Users</Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Wrapper>
  );
};
