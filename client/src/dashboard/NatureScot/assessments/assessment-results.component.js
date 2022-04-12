import React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

import ImpactFeatureDetailsNav from '../assessments/impact-feature-details-nav.component';
import { ImpactSummaryChart } from '../charts/gradient-bar-chart/gradient-bar-chart.component';
import { NatureScotCustomLegend } from '../nature-scot-custom-legend/nature-scot-custom-legend.component';

const testData = [
  { type: 'Habitat', impact: 3 },
  { type: 'Geomorphology', impact: 1 },
  { type: 'Soils', impact: -1 },
  { type: 'Geology', impact: -2 },
  { type: 'Hydrology', impact: 2 },
  { type: 'Connectivity', impact: 0.05 },
  { type: 'Biodiversity', impact: 2 },
  { type: 'Species', impact: -3 },
];

const AssessmentResults = ({ results }) => {
  console.log('results: ', results);
  return (
    <Grid container spacing={5}>
      <Grid container item xs={6} spacing={3}>
        <ChartWrapper title="Impact Summary" info="Impact Summary Description">
          <Typography>
            The chart below shows the overall impact of your proposal against
            eight categories of impact. You may wish to reconsider aspects of
            your proposal where there is a high or medium negative impact.
          </Typography>
          <NatureScotCustomLegend />
          <ImpactSummaryChart data={testData} />
        </ChartWrapper>
      </Grid>
      <Grid container item xs={6} spacing={3}>
        <ChartWrapper
          title="Protected Areas"
          info="Protected Areas Description"
        >
          <Typography>
            Your area of interest overlaps with or is nearby the following
            designated protected areas:
          </Typography>

          <Typography>LIST</Typography>
        </ChartWrapper>
      </Grid>
      <Grid container item xs={6} spacing={3}></Grid>
      <Grid container item xs={6} spacing={3}>
        <ChartWrapper
          title="Impact Detail By Feature"
          info="Impact Detail By Feature Description"
        >
          <ImpactFeatureDetailsNav results={results} />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};

export default AssessmentResults;
