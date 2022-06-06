import React, { useEffect, useState } from 'react';

import {
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@astrosat/astrosat-ui';

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

export const SidebarComponent = ({
  selectedLayer,
  dispatch,
  dateTypes,
  dateLabel,
}) => {
  const styles = useStyles();

  const [selectedDateType, setSelectedDateType] = useState(dateTypes[0].id);

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
      if (feature.properties[selectedDateType] > acc) {
        acc = feature.properties[selectedDateType];
      }
      return acc;
    }, '');

    setLatestDateString(dateString);
  }, [featureCollection, selectedDateType]);

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
          ...filterValue,
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
          {dateLabel}
        </Typography>

        <Typography className={styles.dateHeading} variant="body1">
          Please select the type of date before you select the specific date
          range to apply.
        </Typography>

        <Select
          value={selectedDateType}
          onChange={({ target: { value } }) => {
            setSelectedDateType(value);
            handleChange('dateType')(value);
          }}
        >
          {dateTypes.map(type => (
            <MenuItem key={type.id} value={type.id}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
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
