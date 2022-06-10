import React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

const DATE_FORMAT = 'dd/MM/yyyy - HH:mm:ss';

/**
 * Takes an object of data, for a number of individual ProgressIndicatorCharts.
 *
 * @param {{data: object}} props // Object of data to be used for each chart.
 */
const ProgressIndicators = ({ data }) => {
  const { colors } = useChartTheme();
  return (
    <Grid container spacing={3}>
      {data?.map((indicator, i) => (
        <Grid key={indicator.name} item xs={12} md={3}>
          <ChartWrapper title={indicator.name} info={indicator.info}>
            <ProgressIndicatorChart {...indicator} color={colors[i]} />
          </ChartWrapper>
          <Typography>
            Last reading taken at: {indicator.dateUpdated}
            {/* Last reading taken at: {format(indicator.dateUpdated, DATE_FORMAT)} */}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProgressIndicators;
