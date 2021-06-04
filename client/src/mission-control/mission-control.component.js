import React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

export const MissionControl = () => {
  return (
    <Grid container direction="row" justify="space-between">
      <Grid item>Side Panel</Grid>
      <Grid item>Main Panel</Grid>
    </Grid>
  );
};
