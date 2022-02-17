import React, { useState } from 'react';

import {
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@astrosat/astrosat-ui';

import { subYears } from 'date-fns';
import { useSelector } from 'react-redux';

import { InfoButtonTooltip } from 'components';
import { CheckboxFilters } from 'map/orbs/components/checkbox-filters/checkbox-filters.component';
import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';
import { filterValueSelector, setFilterValue } from 'map/orbs/layers.slice';

const CONSTRUCTION_PHASE_FILTER_INFO =
  'The construction phases are a collection of related phases. For more details please see the user guide.';

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

export const PldSidebarComponent = ({
  selectedLayer,
  dispatch,
  color,
  constructionPhaseFilters,
  developmentTypeFilters,
  iconColor,
  minFilterDate,
  maxFilterDate,
  dateTypes,
}) => {
  const styles = useStyles();

  const [selectedDateType, setSelectedDateType] = useState(dateTypes[0].id);

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
        <Typography className={styles.dateHeading} variant="h4">
          Date Range
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
          minDate={minFilterDate}
          maxDate={maxFilterDate}
          onSubmit={handleChange('dateRange')}
          range={dateRange}
        />
      </Grid>
      <Grid container justifyContent="space-between" alignItems="baseline">
        <Grid item>
          <Typography className={styles.checkboxHeading} variant="h4">
            Construction Phase&nbsp;
          </Typography>
        </Grid>
        <Grid item>
          <InfoButtonTooltip tooltipContent={CONSTRUCTION_PHASE_FILTER_INFO} />
        </Grid>
        <CheckboxFilters
          onChange={handleChange('constructionPhase')}
          filterValue={filterValue?.constructionPhase}
          filters={constructionPhaseFilters}
        />
      </Grid>
      <Grid item>
        <Typography className={styles.checkboxHeading} variant="h4">
          Development Type
        </Typography>
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
