import React from 'react';

import { Grid, makeStyles, Typography, Skeleton } from '@astrosat/astrosat-ui';

import format from 'date-fns/format';
import parse from 'date-fns/parse';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from 'dashboard/charts/chart-wrapper.component';
import {
  ProgressIndicatorChart,
  ProgressIndicatorChartSkeleton,
} from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

import {
  DATE_FORMAT_DISPLAY,
  DATE_PARSE_API,
  METADATA,
} from './h2orb.constants';

const useStyles = makeStyles(theme => ({
  date: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    gap: theme.spacing(1),
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
      {data.map((indicator, i) => (
        <Grid key={indicator.name} item xs={12} sm={6} lg={3}>
          <ChartWrapper
            titleSize="small"
            title={indicator.name}
            info={indicator.info}
          >
            <ProgressIndicatorChart {...indicator} color={colors[i]} />
            <div className={styles.date}>
              <Typography>Last reading taken at:</Typography>
              <Typography>
                {/* {indicator.dateUpdated} */}
                {format(
                  parse(indicator.dateUpdated, DATE_PARSE_API, new Date()),
                  DATE_FORMAT_DISPLAY,
                )}
              </Typography>
            </div>
          </ChartWrapper>
        </Grid>
      ))}
    </Grid>
  );
};

export const ProgressIndicatorSkeletons = () => {
  const styles = useStyles();
  return (
    <Grid item container spacing={3}>
      {Object.keys(METADATA).map(key => (
        <Grid
          role="skeleton"
          alignItems="center"
          key={key}
          item
          xs={12}
          sm={6}
          lg={3}
        >
          <ChartWrapperSkeleton>
            <ProgressIndicatorChartSkeleton />
            <div className={styles.date}>
              <Skeleton variant="rect" width="10rem" height="1rem" />
              <Skeleton variant="rect" width="10rem" height="1rem" />
            </div>
          </ChartWrapperSkeleton>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProgressIndicators;
