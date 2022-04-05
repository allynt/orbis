import React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

import ImpactFeatureDetailsNav from '../assessments/impact-feature-details-nav.component';
import { GradientBarChart } from '../charts/gradient-bar-chart/gradient-bar-chart.component';

const testData = [
  { type: 'Habitat', impact: 3 },
  { type: 'Geomorphology', impact: 1 },
  { type: 'Soils', impact: -1 },
  { type: 'Geology', impact: -2 },
  { type: 'Hydrology', impact: 2 },
  { type: 'Connectivity', impact: 0 },
  { type: 'Biodiversity', impact: 2 },
  { type: 'Species', impact: -3 },
];

const colorScale = {
  highPositive: {
    threshold: 15,
    color: '#7ef664',
  },
  mediumPositive: {
    threshold: 10,
    color: '#b3d567',
  },
  lowPositive: {
    threshold: 5,
    color: '#c7d99f',
  },
  neutral: {
    threshold: 0,
    color: '#d8c06a',
  },
  lowNegative: {
    threshold: -5,
    color: '#eda46c',
  },
  mediumNegative: {
    threshold: -10,
    color: '#f67971',
  },
  highNegative: {
    threshold: -15,
    color: '#f03b30',
  },
};

const ImpactAssesmentLegend = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',
      maxWidth: '50%',
      margin: '1rem 0 1rem auto',
      padding: '1rem',
      border: '2px solid #000',
    }}
  >
    {Object.entries(colorScale).map(([key, value]) => (
      <div key={key}>
        <span
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            border: '1px solid red',
            backgroundColor: value.color,
          }}
        />
        <span
          style={{
            margin: '0 1rem',
          }}
        >
          {key}
        </span>
      </div>
    ))}
  </div>
);

const AssessmentResults = ({ results }) => (
  <Grid container spacing={5}>
    <Grid container item xs={6} spacing={3}>
      <ChartWrapper title="Impact Summary" info="Impact Summary Description">
        <Typography>
          The chart below shows the overall impact of your proposal against
          eight categories of impact. You may wish to reconsider aspects of your
          proposal where there is a high or medium negative impact.
        </Typography>
        <ImpactAssesmentLegend />
        <GradientBarChart data={testData} pad={5} />
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
      <ChartWrapper
        title="Impact Detail By Feature"
        info="Impact Detail By Feature Description"
      >
        <ImpactFeatureDetailsNav results={results} />
      </ChartWrapper>
    </Grid>
  </Grid>
);

export default AssessmentResults;
