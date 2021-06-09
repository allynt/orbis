import * as React from 'react';

import { Avatar, Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import busy from './icons/busy.svg';
import notBusy from './icons/not-busy.svg';
import veryBusy from './icons/very-busy.svg';

const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  icon: {
    width: '2.75rem',
    height: '2.75rem',
    boxShadow: theme.shadows[3],
  },
  blank: {
    width: '100%',
    height: '100%',
    '&$notBusy': {
      backgroundColor: '#ccfae3',
    },
    '&$busy': {
      backgroundColor: '#feeccc',
    },
    '&$veryBusy': {
      backgroundColor: '#fad2df',
    },
  },
  notBusy: {},
  busy: {},
  veryBusy: {},
}));

const icons = [
  {
    category: 'not busy',
    className: 'notBusy',
    icon: notBusy,
  },
  {
    category: 'busy',
    className: 'busy',
    icon: busy,
  },
  {
    category: 'very busy',
    className: 'veryBusy',
    icon: veryBusy,
  },
];

/**
 * @param {{
 *   feature?: CrowdlessFeature
 * }} props
 */
const CrowdlessMapComponent = ({ feature }) => {
  const {
    address = undefined,
    name = undefined,
    crowdednessCategory = undefined,
    crowdednessScore = undefined,
  } = feature?.properties || {};
  const styles = useStyles();

  return (
    <Grid className={styles.wrapper} container spacing={2}>
      {icons.map(({ category, className, icon }) => (
        <Grid key={category} item xs={3}>
          <Avatar
            className={styles.icon}
            variant="rounded"
            src={crowdednessCategory === category ? icon : ''}
          >
            <div className={clsx(styles.blank, styles[className])} />
          </Avatar>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Typography gutterBottom>
          Estimated crowdedness: {crowdednessScore}%
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2" component="h2" gutterBottom>
          {name}
        </Typography>
        <Typography>{address}</Typography>
      </Grid>
    </Grid>
  );
};

export default CrowdlessMapComponent;
