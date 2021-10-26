import * as React from 'react';

import { Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { CheckboxFilters } from 'map/orbs/components/checkbox-filters/checkbox-filters.component';
import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';
import { filterValueSelector, setFilterValue } from 'map/orbs/layers.slice';

const useStyles = makeStyles(() => ({
  wrapper: {
    height: '100%',
    width: '100%',
  },
}));

export const PldSidebarComponent = ({
  selectedLayer,
  dispatch,
  color,
  constructionPhaseFilters,
  developmentTypeFilters,
  iconColor,
}) => {
  const styles = useStyles();
  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer?.source_id)(state?.orbs),
  );

  const handleChange = filter => newFilterValue =>
    dispatch(
      setFilterValue({
        ...filterValue,
        [filter]: newFilterValue,
      }),
    );

  return (
    <Grid className={styles.wrapper} container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4">Date Range</Typography>
        <DateRangeFilter
          maxDate="today"
          onSubmit={handleChange('dateRange')}
          range={filterValue['dataRange']}
        />
      </Grid>
      <Grid item>
        <Typography variant="h4">Construction Phase</Typography>
        <CheckboxFilters
          onChange={handleChange('constructionPhase')}
          filterValue={filterValue['constructionPhase']}
          filters={constructionPhaseFilters}
        />
      </Grid>
      <Grid item>
        <Typography variant="h4">Development Type</Typography>
        <CheckboxFilters
          onChange={handleChange('developmentType')}
          filterValue={filterValue['developmentType']}
          filters={developmentTypeFilters}
          color={color}
          iconColor={iconColor}
        />
      </Grid>
    </Grid>
  );
};
