import React from 'react';

import { Grid, makeStyles } from '@astrosat/astrosat-ui';

import ScoringDisplay from './scoring-display';

const useStyles = makeStyles(theme => ({
  '& .MuiGrid-root': {
    padding: '0',
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
}));

const ImpactFeatureDetailsLegend = () => {
  const styles = useStyles();
  return (
    <Grid className={styles.container} container wrap="wrap" direction="row">
      <ScoringDisplay score={3} legend={true} />
      <ScoringDisplay score={2} legend={true} />
      <ScoringDisplay score={1} legend={true} />
      <ScoringDisplay score={0} legend={true} />
      <ScoringDisplay score={-1} legend={true} />
      <ScoringDisplay score={-2} legend={true} />
      <ScoringDisplay score={-3} legend={true} />
    </Grid>
  );
};

export default ImpactFeatureDetailsLegend;
