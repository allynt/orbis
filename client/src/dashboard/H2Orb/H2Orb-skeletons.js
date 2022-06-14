import React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

import { H2OrbProgressIndicatorSkeletons } from './H2Orb-progress-indicators.component';

/**
 * More skeletons can be added here as the dashboard develops.
 */
const H2OrbSkeletons = () => (
  <Grid item container direction="column">
    <H2OrbProgressIndicatorSkeletons />
  </Grid>
);

export default H2OrbSkeletons;
