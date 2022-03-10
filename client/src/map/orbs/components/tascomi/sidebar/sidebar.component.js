import React from 'react';

import { Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

import { subYears } from 'date-fns';
import { useSelector } from 'react-redux';

import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';
import {
  dataSelector,
  filterValueSelector,
  setFilterValue,
} from 'map/orbs/layers.slice';

import { DATE_TYPE } from '../../../configurations/tascomiMapConfig';

const DEFAULT_DATE_RANGE = {
  startDate: subYears(new Date(2020, 2, 26), 1).toISOString(),
  endDate: new Date(2020, 2, 26).toISOString(),
};

const useStyles = makeStyles(theme => ({
  dateHeading: {
    paddingBottom: '0.5rem',
  },
  checkboxHeading: {
    paddingBottom: '1rem',
  },
}));

export const SidebarComponent = ({ selectedLayer, dispatch }) => {
  const styles = useStyles();

  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer?.source_id)(state?.orbs),
  );
  const featureCollection = useSelector(state =>
    dataSelector(selectedLayer?.source_id)(state?.orbs),
  );
  const latestDateString = featureCollection?.features.reduce(
    (acc, feature) => {
      if (feature.properties[DATE_TYPE] > acc) {
        acc = feature.properties[DATE_TYPE];
      }
      return acc;
    },
    '',
  );

  const handleChange = filter => newFilterValue =>
    dispatch(
      setFilterValue({
        key: selectedLayer?.source_id,
        filterValue: {
          ...filterValue,
          [filter]:
            filter === 'dateRange' &&
            newFilterValue.startDate == null &&
            newFilterValue.endDate == null
              ? DEFAULT_DATE_RANGE
              : newFilterValue,
        },
      }),
    );

  const { startDate, endDate } = filterValue?.dateRange || {};

  let dateRange = null;
  if (latestDateString) {
    const lastDate = new Date(latestDateString);
    dateRange = {
      startDate: startDate || subYears(lastDate, 1).toISOString(),
      endDate: endDate || lastDate.toISOString(),
    };
  } else {
    dateRange = {
      startDate: startDate || DEFAULT_DATE_RANGE.startDate,
      endDate: endDate || DEFAULT_DATE_RANGE.endDate,
    };
  }

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
        <DateRangeFilter
          onSubmit={handleChange('dateRange')}
          range={dateRange}
        />
      </Grid>
    </Grid>
  );
};
