import React from 'react';

import { Grid, makeStyles, Skeleton, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

const useStyles = makeStyles(theme => ({
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
    margin: '1rem 3rem',
  },
  gap: {
    margin: '0.5rem',
  },
  date: {
    marginTop: theme.spacing(2),
  },
}));

/**
 * Takes an object of data, for a number of individual ProgressIndicatorCharts.
 *
 * @param {{data: object}} props // Object of data to be used for each chart.
 */
const ProgressIndicators = ({ data }) => {
  const { colors } = useChartTheme();
  const styles = useStyles();
  return (
    <Grid item container spacing={3}>
      {data?.map((indicator, i) => (
        <Grid key={indicator.name} item xs={12} md={3}>
          <ChartWrapper
            titleSize="small"
            title={indicator.name}
            info={indicator.info}
          >
            <ProgressIndicatorChart {...indicator} color={colors[i]} />
            <Typography className={styles.date}>
              Last reading taken at:
              <br />
              {indicator.dateUpdated}
              {/* Last reading taken at: {format(indicator.dateUpdated, DATE_FORMAT)} */}
            </Typography>
          </ChartWrapper>
        </Grid>
      ))}
    </Grid>
  );
};

export const ProgressIndicatorSkeleton = () => {
  const styles = useStyles();
  return (
    <Grid item>
      <Skeleton
        className={styles.circle}
        variant="circle"
        width={'8rem'}
        height={'8rem'}
      />
      <Skeleton
        className={styles.gap}
        variant="rect"
        width={'10rem'}
        height={'1rem'}
      />
      <Skeleton
        className={styles.gap}
        variant="rect"
        width={'10rem'}
        height={'1rem'}
      />
    </Grid>
  );
};

export default ProgressIndicators;
