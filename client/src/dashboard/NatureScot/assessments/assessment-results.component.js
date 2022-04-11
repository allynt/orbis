import React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

import ImpactFeatureDetails from './impact-feature-details.component';

const AssessmentResults = () => (
  <Grid container spacing={5}>
    <Grid container item xs={6} spacing={3}>
      <ChartWrapper title="Impact Summary" info="Impact Summary Description">
        <Typography>
          The chart below shows the overall impact of your proposal against
          eight categories of impact. You may wish to reconsider aspects of your
          proposal where there is a high or medium negative impact.
        </Typography>

        <Typography>LEGEND</Typography>

        <Typography>CHART</Typography>
      </ChartWrapper>
    </Grid>
    <Grid container item xs={6} spacing={3}>
      <ChartWrapper title="Protected Areas" info="Protected Areas Description">
        <Typography>
          Your area of interest overlaps with or is nearby the following
          designated protected areas:
        </Typography>

        <Typography>LIST</Typography>
      </ChartWrapper>
    </Grid>
    <Grid container item xs={6} spacing={3}></Grid>
    <Grid container item xs={6} spacing={3}>
      <ImpactFeatureDetails />
    </Grid>
  </Grid>
);

export default AssessmentResults;
