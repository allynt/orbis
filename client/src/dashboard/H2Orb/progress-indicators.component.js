import React from 'react';

import { Grid, makeStyles, Skeleton, Typography } from '@astrosat/astrosat-ui';

import { parse, format } from 'date-fns';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

import { DATE_FORMAT_DISPLAY, DATE_PARSE_API } from './H2Orb.constants';

const useStyles = makeStyles(theme => ({
  skeletonContainer: {
    gap: theme.spacing(1),
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `${theme.spacing(2)} 0`,
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
      {data.map((indicator, i) => (
        <Grid key={indicator.name} item xs={12} md={6} lg={3}>
          <ChartWrapper
            titleSize="small"
            title={indicator.name}
            info={indicator.info}
          >
            <ProgressIndicatorChart {...indicator} color={colors[i]} />
            <Typography className={styles.date}>
              Last reading taken at:
              <br />
              {/* {indicator.dateUpdated} */}
              {format(
                parse(indicator.dateUpdated, DATE_PARSE_API, new Date()),
                DATE_FORMAT_DISPLAY,
              )}
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
    <Grid item className={styles.skeletonContainer}>
      <div className={styles.circle}>
        <Skeleton variant="circle" width={'8rem'} height={'8rem'} />
      </div>
      <Skeleton variant="rect" width={'10rem'} height={'1rem'} />
      <Skeleton variant="rect" width={'10rem'} height={'1rem'} />
    </Grid>
  );
};

export default ProgressIndicators;
