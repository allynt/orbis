import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  filterValueSelector,
  setFilterValue,
  filterStatusValueSelector,
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

  const filterStatus = useSelector(state =>
    filterStatusValueSelector(selectedLayer.source_id)(state?.orbs),
  );

  const handleFilterSubmit = range => {
    dispatch(
      setFilterValue({
        key: selectedLayer.source_id,
        filterValue: range,
      }),
    );
  };

  const handleStatusSubmit = status => {
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
        onSubmit={handleFilterSubmit}
        minDate={minDate}
        maxDate={maxDate}
        range={filterValue}
      />
      <StatusFilter status={filterStatus} onSubmit={handleStatusSubmit} />
    </Grid>
  );
};
