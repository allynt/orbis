import React from 'react';

import { Grid, makeStyles, Skeleton, Typography } from '@astrosat/astrosat-ui';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from 'dashboard/charts/chart-wrapper.component';
import { GaugeChart } from 'dashboard/charts/gauge/gauge.component';

import ProtectedFeatureButtonGroup from './protected-feature-button-group.component';
import ProtectedFeatureList from './protected-feature-list.component';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
  },
  container: {
    gap: '1rem',
  },
  gauge: {},
  features: {
    display: 'flex',
    flexDirection: 'column',
  },
  leftPanel: {
    width: 'calc(33.3% - 0.5rem)',
  },
  rightPanel: {
    width: 'calc(66.6% - 0.5rem)',
  },
  chart: {
    paddingRight: '1rem',
  },
  heading: {
    backgroundColor: '#34414a',
    color: '#fff',
    fontWeight: 600,
    padding: '1rem',
  },
}));

const skeletonStyles = makeStyles(theme => ({
  areas: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    border: '5px solid #333f48',
    marginTop: '2rem',
  },
  text: {
    color: 'red',
    backgroundColor: 'green',
  },
  cell: {
    color: 'red',
    backgroundColor: 'green',
  },
}));

const ProtectedFeature = ({ buttons, features, onSubmit }) => {
  const styles = useStyles();

  return (
    <ChartWrapper
      title="Protected Features"
      info="The description for this panel"
    >
      <Grid
        container
        justifyContent="space-between"
        className={styles.container}
      >
        <Grid item className={styles.leftPanel}>
          <Typography variant="h5" className={styles.heading}>
            General EcoHealth of Selected Area
          </Typography>
          <GaugeChart />
        </Grid>

        <Grid item className={styles.rightPanel}>
          <ProtectedFeatureButtonGroup buttons={buttons} onSubmit={onSubmit} />
          <ProtectedFeatureList features={features} />
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};

export const ProtectedFeatureSkeleton = () => {
  const styles = skeletonStyles();
  return (
    <ChartWrapperSkeleton>
      <div className={styles.areas}>
        <Skeleton variant="rect" width={'50%'} height={'15rem'} />
      </div>
    </ChartWrapperSkeleton>
  );
};

export default ProtectedFeature;
