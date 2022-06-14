import React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

import { ChartWrapperSkeleton } from 'dashboard/charts/chart-wrapper.component';

import { METADATA } from './H2Orb.constants';
import { ProgressIndicatorSkeleton } from './progress-indicators.component';

export const ProgressIndicatorsSkeleton = () => {
  const dialKeys = Array(Object.keys(METADATA))[0];
  return (
    <Grid item container spacing={3}>
      {dialKeys.map(num => (
        <Grid
          role="skeleton"
          alignItems="center"
          key={`skel_${num}`}
          item
          xs={12}
          md={6}
          lg={3}
        >
          <ChartWrapperSkeleton key={`skel_${num}`}>
            <ProgressIndicatorSkeleton key={num} />
          </ChartWrapperSkeleton>
        </Grid>
      ))}
    </Grid>
  );
};
