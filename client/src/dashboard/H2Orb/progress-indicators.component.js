import React from 'react';

import { Grid, makeStyles, Skeleton, Typography } from '@astrosat/astrosat-ui';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

import { METADATA } from './H2Orb.constants';

const skeletonStyles = makeStyles(theme => ({
  areas: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px solid #333f48',
    margin: '2rem',
    padding: '2rem',
    gap: '2rem',
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1rem 5rem',
  },
  gap: {
    margin: '0.5rem',
  },
}));

const ProgressIndicatorSkeleton = () => {
  const styles = skeletonStyles();
  return (
    <Grid>
      <Skeleton
        className={styles.circle}
        variant="circle"
        width={'8rem'}
        height={'8rem'}
      />
      <Skeleton
        className={styles.gap}
        variant="rect"
        width={'15rem'}
        height={'1rem'}
      />
      <Skeleton
        className={styles.gap}
        variant="rect"
        width={'15rem'}
        height={'1rem'}
      />
    </Grid>
  );
};

/**
 * Takes an object of data, for a number of individual ProgressIndicatorCharts.
 *
 * @param {{data: object}} props // Object of data to be used for each chart.
 */
const ProgressIndicators = ({ data }) => {
  const { colors } = useChartTheme();
  const dialKeys = Array(Object.keys(METADATA))[0];
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
        : dialKeys.map(num => (
            <Grid alignItems="center" key={`skel_${num}`} item xs={12} md={3}>
              <ChartWrapperSkeleton key={`skel_${num}`}>
                <ProgressIndicatorSkeleton key={num} />
              </ChartWrapperSkeleton>
            </Grid>
          ))}
    </Grid>
  );
};

export default ProgressIndicators;
