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
      {[3, 2, 1, 0, -1, -2, -3].map(score => (
        <ScoringDisplay key={`legend_${score}`} score={score} legend={true} />
      ))}
    </Grid>
  );
};

export default ImpactFeatureDetailsLegend;
