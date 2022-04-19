import React from 'react';

import { Grid, makeStyles } from '@astrosat/astrosat-ui';

import { AddCircle, RemoveCircle } from '@material-ui/icons';

import { IMPACT_SUMMARY_LEGEND_DATA } from '../nature-scotland.constants';
import NeutralIcon from './neutral-icon';

const useStyles = makeStyles(theme => ({
  '& .MuiGrid-root': {
    padding: '5px',
  },
  container: {
    margin: '1rem',
    padding: '0.5rem ',
    alignItems: 'center',
  },
  label: {
    fontSize: '0.7rem',
    color: '#fff',
    position: 'relative',
    top: '-6px',
    left: '3px',
  },
  minus3: {
    color: IMPACT_SUMMARY_LEGEND_DATA['High -ve'],
  },
  minus2: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Medium -ve'],
  },
  minus1: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Low -ve'],
  },
  zero: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Neutral'],
  },
  plus1: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Low +ve'],
  },
  plus2: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Medium +ve'],
  },
  plus3: {
    color: IMPACT_SUMMARY_LEGEND_DATA['High +ve'],
  },
}));

const ImpactFeatureDetailsLegend = () => {
  const styles = useStyles();
  return (
    <Grid className={styles.container} container wrap="wrap" direction="row">
      <Grid className={styles.plus3} xs={3}>
        <AddCircle />
        <AddCircle />
        <AddCircle />
        <span className={styles.label}>High Positive</span>
      </Grid>
      <Grid className={styles.plus2} xs={3}>
        <AddCircle />
        <AddCircle />
        <span className={styles.label}>Medium Positive</span>
      </Grid>
      <Grid className={styles.plus1} xs={3}>
        <AddCircle />
        <span className={styles.label}>Low Positive</span>
      </Grid>
      <Grid className={styles.zero} xs={3}>
        <NeutralIcon />
        <span className={styles.label}>Neutral</span>
      </Grid>
      <Grid className={styles.minus1} xs={3}>
        <RemoveCircle />
        <span className={styles.label}>Low Negative</span>
      </Grid>
      <Grid className={styles.minus2} xs={3}>
        <RemoveCircle />
        <RemoveCircle />
        <span className={styles.label}>Medium Negative</span>
      </Grid>
      <Grid className={styles.minus3} xs={3}>
        <RemoveCircle />
        <RemoveCircle />
        <RemoveCircle />
        <span className={styles.label}>High Negative</span>
      </Grid>
    </Grid>
  );
};

export default ImpactFeatureDetailsLegend;
