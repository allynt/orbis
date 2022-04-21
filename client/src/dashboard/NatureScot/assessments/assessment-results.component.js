import React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

import { ImpactSummary } from '../charts/impact-summary/impact-summary.component';
import AssessmentActivityImpacts from './assessment-activity-impacts';
import ImpactFeatureDetails from './impact-feature-details.component';
import ProtectedAreasList from './protected-areas-list.component';

/**
 * @param {{ results: object }} props
 */
const AssessmentResults = ({ results }) => (
  <Grid container spacing={5}>
    <Grid item xs={6}>
      <ImpactSummary data={results?.summary} />
    </Grid>
    <Grid container item xs={6} spacing={3}>
      <ProtectedAreasList areas={results?.areas} />
    </Grid>
    <Grid container item xs={12} spacing={3}>
      <AssessmentActivityImpacts data={results?.impacts} />
    </Grid>
    <Grid container item xs={6} spacing={3}>
      <ImpactFeatureDetails data={results} />
    </Grid>
  </Grid>
);

export default AssessmentResults;
