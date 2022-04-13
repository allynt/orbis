import React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

import { ImpactSummary } from '../charts/impact-summary/impact-summary.component';
import ImpactFeatureDetails from './impact-feature-details.component';

/**
 * @param {{ results: object }} props
 */
const AssessmentResults = ({ results }) => (
  <Grid container spacing={5}>
    <Grid item xs={6}>
      <ImpactSummary data={results?.summary} />
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
      <ImpactFeatureDetails data={results} />
    </Grid>
  </Grid>
);

export default AssessmentResults;
