import React, { useEffect, useState } from 'react';

import { Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

import { subYears } from 'date-fns';
import { useSelector } from 'react-redux';

import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';
import {
  dataSelector,
  filterValueSelector,
  setFilterValue,
} from 'map/orbs/layers.slice';

const useStyles = makeStyles(theme => ({
  dateHeading: {
    paddingBottom: '0.5rem',
  },
  checkboxHeading: {
    paddingBottom: '1rem',
  },
}));

export const SidebarComponent = ({ selectedLayer, dispatch, dateType }) => {
  const styles = useStyles();

  const [dateRange, setDateRange] = useState(null);
  const [latestDateString, setLatestDateString] = useState(null);

  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer?.source_id)(state?.orbs),
  );
  const { startDate, endDate } = filterValue?.dateRange || {};

  const featureCollection = useSelector(state =>
    dataSelector(selectedLayer?.source_id)(state?.orbs),
  );

  // Figure out the latest date in the data.
  useEffect(() => {
    const dateString = featureCollection?.features.reduce((acc, feature) => {
      if (feature.properties[dateType] > acc) {
        acc = feature.properties[dateType];
      }
      return acc;
    }, '');

    setLatestDateString(dateString);
  }, [featureCollection, dateType]);

  // When latest date changes, set the date range to be used.
  useEffect(() => {
    if (latestDateString) {
      const lastDate = new Date(latestDateString);
      setDateRange({
        startDate: startDate || subYears(lastDate, 1).toISOString(),
        endDate: endDate || lastDate.toISOString(),
      });
    }
  }, [latestDateString, startDate, endDate]);

  // Set the filter to the date range selected.
  useEffect(() => {
    dispatch(
      setFilterValue({
        key: selectedLayer?.source_id,
        filterValue: {
          dateRange,
        },
      }),
    );
  }, [dateRange, selectedLayer, dispatch]);

  const handleChange = filter => newFilterValue =>
    dispatch(
      setFilterValue({
        key: selectedLayer?.source_id,
        filterValue: {
          ...filterValue,
          [filter]: newFilterValue,
        },
      }),
    );

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography className={styles.dateHeading} variant="h4">
          Date Range
        </Typography>

        <Typography className={styles.dateHeading} variant="body1">
          Please select the type of date before you select the specific date
          range to apply.
        </Typography>
      </Grid>

      <Grid item>
        <Typography className={styles.dateHeading} variant="h4">
          Decision Date
        </Typography>

        <DateRangeFilter
          onSubmit={handleChange('dateRange')}
          range={dateRange}
        />
      </Grid>
    </Grid>
  );
};
