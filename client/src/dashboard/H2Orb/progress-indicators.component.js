import React from 'react';

import { Grid, makeStyles, Skeleton, Typography } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

const DATE_FORMAT = 'dd/MM/yyyy - HH:mm:ss';

const styles = makeStyles(theme => ({
  areas: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px solid #333f48',
    margin: '2rem',
    padding: '2rem',
    gap: '2rem',
    // width: '15rem',
    // height: '15rem',
  },
}));

const ProgressIndicatorSkeleton = () => {
  return (
    <div className={styles.areas}>
      <Skeleton variant="rect" width={'15rem'} height={'15rem'} />
    </div>
  );
};

/**
 * Takes an object of data, for a number of individual ProgressIndicatorCharts.
 *
 * @param {{data: object}} props // Object of data to be used for each chart.
 */
const ProgressIndicators = ({ data }) => {
  const { colors } = useChartTheme();
  return (
    <Grid alignItems="stretch" container spacing={3}>
      {data
        ? data?.map((indicator, i) => (
            <Grid key={indicator.name} item xs={12} md={3}>
              <ChartWrapper
                titleSize="small"
                title={indicator.name}
                info={indicator.info}
              >
                <ProgressIndicatorChart {...indicator} color={colors[i]} />
                <Typography>
                  Last reading taken at:
                  <br />
                  {indicator.dateUpdated}
                  {/* Last reading taken at: {format(indicator.dateUpdated, DATE_FORMAT)} */}
                </Typography>
              </ChartWrapper>
            </Grid>
          ))
        : [1, 2, 3, 4].map(num => <ProgressIndicatorSkeleton key={num} />)}
    </Grid>
  );
};

export default ProgressIndicators;
