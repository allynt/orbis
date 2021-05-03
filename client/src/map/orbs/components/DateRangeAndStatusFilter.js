import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  filterValueSelector,
  setFilterValue,
  selectedStatusValueSelector,
  setSelectedStatus,
} from '../layers.slice';
import { StatusFilter } from './status-filter/status-filter.component';
import { DateRangeFilter } from './date-range-filter/date-range-filter.component';
import { Grid, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  container: {
    gap: theme.spacing(2),
  },
}));

export default ({ selectedLayer, minDate, maxDate }) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer.source_id)(state?.orbs),
  );

  const currentStatus = useSelector(state =>
    selectedStatusValueSelector(selectedLayer.source_id)(state?.orbs),
  );

  const handleSubmit = range => {
    dispatch(
      setFilterValue({
        key: selectedLayer.source_id,
        filterValue: range,
      }),
    );
  };

  const handleStatusSelect = status => {
    dispatch(
      setSelectedStatus({
        key: selectedLayer.source_id,
        selectedStatus: status.toUpperCase(),
      }),
    );
  };

  return (
    <Grid container direction="column" className={styles.container}>
      <DateRangeFilter
        onSubmit={handleSubmit}
        minDate={minDate}
        maxDate={maxDate}
        range={filterValue}
      />
      <StatusFilter status={currentStatus} onSubmit={handleStatusSelect} />
    </Grid>
  );
};
