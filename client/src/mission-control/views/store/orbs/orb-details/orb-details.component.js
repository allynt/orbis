import React, { useState } from 'react';

import {
  Button,
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
  wrapper: {
    display: 'grid',
    rowGap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      gridTemplateAreas: `"back name"
       "image description"
       "image select"
       "image link"`,
      gridTemplateColumns: '1fr clamp(1ch, 50%, 70ch)',
      columnGap: theme.spacing(3),
    },
  },
  name: {
    fontWeight: 600,
    fontSize: '50px',
    [theme.breakpoints.up('md')]: {
      gridArea: 'name',
    },
  },
  description: {
    [theme.breakpoints.up('md')]: {
      gridArea: 'description',
    },
  },
  back: { padding: '4px 5px', width: 'fit-content' },
  icon: { transform: 'rotate(180deg)' },
  image: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(640),
    objectFit: 'cover',
    marginInline: 'auto',
    [theme.breakpoints.up('md')]: {
      gridArea: 'image',
    },
  },
  selectWrapper: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
      '& p': {
        marginRight: theme.spacing(2),
      },
    },
    [theme.breakpoints.up('md')]: {
      gridArea: 'select',
    },
  },
  link: {
    textDecoration: 'none',
    [theme.breakpoints.up('md')]: {
      gridArea: 'link',
    },
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
  const { orbId } = match.params;
  const orb = find(orbs, { id: +orbId });

  if (!orb) return null;

  const { images, name, description } = orb;

  return (
    <Wrapper className={styles.wrapper} maxWidth={false}>
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
      {images && (
        <img className={styles.image} src={images[0]} alt={`${name} Example`} />
      )}
      <Typography className={styles.name} variant="h1">
        {name}
      </Typography>
      <Typography className={styles.description}>{description}</Typography>
      <div className={styles.selectWrapper}>
        <Typography>How many Users do you need?</Typography>
        <Select
          fullWidth={!smUp}
          value={numberOfUsers}
          // @ts-ignore
          onChange={event => setNumberOfUsers(event.target.value)}
          inputProps={{ 'aria-label': 'Number of Users' }}
        >
          {selectOptions}
        </Select>
      </div>
      <Link
        className={styles.link}
        to={`${match.url?.replace(
          `/${orbId}`,
          '',
        )}/checkout/?orbId=${orbId}&users=${numberOfUsers}`}
      >
        <Button>Get Access</Button>
      </Link>
    </Wrapper>
  );
};
