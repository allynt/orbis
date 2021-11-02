import * as React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { subYears } from 'date-fns';
import { useSelector } from 'react-redux';

import { CheckboxFilters } from 'map/orbs/components/checkbox-filters/checkbox-filters.component';
import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';
import { filterValueSelector, setFilterValue } from 'map/orbs/layers.slice';

const DEFAULT_DATE_RANGE = {
  startDate: subYears(new Date(2020, 2, 26), 1).toISOString(),
  endDate: new Date(2020, 2, 26).toISOString(),
};

export const PldSidebarComponent = ({
  selectedLayer,
  dispatch,
  color,
  constructionPhaseFilters,
  developmentTypeFilters,
  iconColor,
}) => {
  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer?.source_id)(state?.orbs),
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

  const dateRange = {
    startDate: startDate || DEFAULT_DATE_RANGE.startDate,
    endDate: endDate || DEFAULT_DATE_RANGE.endDate,
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4">Date Range</Typography>
        <DateRangeFilter
          maxDate="today"
          onSubmit={handleChange('dateRange')}
          range={dateRange}
        />
      </Grid>
      <Grid item>
        <Typography variant="h4">Construction Phase</Typography>
        <CheckboxFilters
          onChange={handleChange('constructionPhase')}
          filterValue={filterValue?.constructionPhase}
          filters={constructionPhaseFilters}
        />
      </Grid>
      <Grid item>
        <Typography variant="h4">Development Type</Typography>
        <CheckboxFilters
          onChange={handleChange('developmentType')}
          filterValue={filterValue?.developmentType}
          filters={developmentTypeFilters}
          color={color}
          iconColor={iconColor}
        />
      </Grid>
    </Grid>
  );
};
