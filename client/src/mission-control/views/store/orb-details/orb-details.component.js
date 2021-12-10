import React, { useState } from 'react';

import {
  Button,
  Link,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { PlayArrow } from '@material-ui/icons';
import { find } from 'lodash';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import { Wrapper } from 'mission-control/shared-components/wrapper.component';

const MIN_USERS = 3;
const MAX_USERS = 30;
const selectOptions = new Array(MAX_USERS + 1)
  .fill(undefined, MIN_USERS)
  .map((_, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <MenuItem value={i} key={`menu-item-${i}`}>
      {i}
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
    aspectRatio: '16/9',
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
 * }} props
 */
export const OrbDetails = ({ orbs }) => {
  const navigate = useNavigate();
  const { orbId } = useParams();
  const styles = useStyles();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const [numberOfUsers, setNumberOfUsers] = useState(10);
  const orb = find(orbs, { id: +orbId });

  if (!orb) return null;

  const { images, name, description, can_purchase } = orb;

  const goBack = () => navigate(-1);

  return (
    <Wrapper className={styles.wrapper}>
      <Button
        // @ts-ignore
        role="link"
        classes={{ root: styles.back }}
        // classes={{ root: styles.back, startIcon: styles.icon }}
        startIcon={<PlayArrow />}
        variant="text"
        size="small"
        color="default"
        onClick={() => goBack()}
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
      {can_purchase ? (
        <>
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
          <RouterLink
            className={styles.link}
            to={`/mission-control/store/checkout/${orbId}/${numberOfUsers}`}
          >
            <Button>Get Access</Button>
          </RouterLink>
        </>
      ) : (
        <div>
          This orb cannot currently be purchased via the application. If you are
          interested in accessing its data, please contact &nbsp;
          <Link className={styles.link} href="mailto:sales@astrosat.net">
            sales@astrosat.net
          </Link>
          .
        </div>
      )}
    </Wrapper>
  );
};
