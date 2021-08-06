import React, { useState } from 'react';

import {
  Button,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { PlayArrow } from '@material-ui/icons';
import { find } from 'lodash';
import { Link } from 'react-router-dom';

import { Wrapper } from '../wrapper.component';

const MAX_USERS = 30;
const selectOptions = new Array(MAX_USERS).fill().map((_, i) => (
  <MenuItem value={i + 1} key={`menu-item-${i + 1}`}>
    {i + 1}
  </MenuItem>
));

const useStyles = makeStyles(theme => ({
  name: { fontWeight: 600, fontSize: '50px' },
  back: { padding: '4px 5px' },
  icon: { transform: 'rotate(180deg)' },
  image: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(640),
    marginBlock: 'auto',
    objectFit: 'cover',
  },
  link: {
    color: 'unset',
    textDecoration: 'none',
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
  const [numberOfUsers, setNumberOfUsers] = useState(10);
  const styles = useStyles();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const { orbId } = match.params;
  const orb = find(orbs, { id: +orbId });

  if (!orb) return null;

  const { images, name, description } = orb;

  return (
    <Wrapper maxWidth={false}>
      <Grid container spacing={mdUp ? 6 : 2}>
        <Grid item sm={6} container direction="column" spacing={smUp ? 8 : 2}>
          <Grid item>
            <Button
              // @ts-ignore
              role="link"
              classes={{ root: styles.back, startIcon: styles.icon }}
              startIcon={<PlayArrow />}
              variant="text"
              size="small"
              color="default"
              onClick={() => history.goBack()}
            >
              Back
            </Button>
          </Grid>
          {images && (
            <Grid item container>
              <img
                className={styles.image}
                src={images[0]}
                alt={`${name} Example`}
              />
            </Grid>
          )}
        </Grid>
        <Grid item sm={6} container direction="column" spacing={smUp ? 4 : 2}>
          <Grid item>
            <Typography className={styles.name} variant="h1">
              {name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>{description}</Typography>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            alignItems="center"
            style={{ marginTop: 'auto' }}
          >
            <Grid item xs={12} md={6} lg={5}>
              <Typography>How many Users do you need?</Typography>
            </Grid>
            <Grid item>
              <Select
                value={numberOfUsers}
                // @ts-ignore
                onChange={event => setNumberOfUsers(event.target.value)}
                inputProps={{ 'aria-label': 'Number of Users' }}
              >
                {selectOptions}
              </Select>
            </Grid>
          </Grid>
          <Grid item>
            <Link
              className={styles.link}
              to={`${match.url}/checkout?orbId=${orbId}&users=${numberOfUsers}`}
            >
              <Button>Get Access</Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Wrapper>
  );
};
