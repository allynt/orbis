import * as React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { subYears } from 'date-fns';
import { useSelector } from 'react-redux';

import { CheckboxFilters } from 'map/orbs/components/checkbox-filters/checkbox-filters.component';
import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';
import { filterValueSelector, setFilterValue } from 'map/orbs/layers.slice';

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
        filterValue: { ...filterValue, [filter]: newFilterValue },
      }),
    );

  const { startDate, endDate } = filterValue?.dateRange || {};

  const dateRange = {
    startDate: startDate || subYears(Date.now(), 10).toISOString(),
    endDate: endDate || new Date().toISOString(),
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
