import * as React from 'react';

import { alpha, makeStyles, Typography } from '@astrosat/astrosat-ui';

import { Busy, NotBusy, VeryBusy } from './icons';

const useStyles = makeStyles(theme => ({
  description: {
    display: 'grid',
    gridTemplateColumns: '1rem 1fr',
    fontSize: theme.typography.pxToRem(10),
    gap: '1rem',
    alignItems: 'center',
  },
  heading: {
    fontSize: '1.2em',
    gridColumn: '1 / -1',
  },
  icon: {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    boxShadow: `2px 4px 4px ${alpha(theme.palette.grey[500], 0.5)}`,
  },
  text: {
    fontSize: 'inherit',
  },
}));

export const Description = () => {
  const styles = useStyles();
  return (
    <div className={styles.description}>
      <Typography variant="h1" component="h1" className={styles.heading}>
        Estimated a crowdedness score:
      </Typography>
      <NotBusy className={styles.icon} />
      <Typography className={styles.text}>
        Not so busy (1-35%) means there are few people present and no queues are
        expected.
      </Typography>
      <Busy className={styles.icon} />
      <Typography className={styles.text}>
        Busy (36-70%) means there are many people present and often queues form.
      </Typography>
      <VeryBusy className={styles.icon} />
      <Typography className={styles.text}>
        Very busy (over 70%) means there are likely to be large crowds or long
        queues.
      </Typography>
    </div>
  );
};
