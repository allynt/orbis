import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  filterValueSelector,
  setFilterValue,
  statusValueSelector,
  setSelectedStatus,
} from '../layers.slice';
import { StatusFilter } from './status-filter/status-filter.component';
import { DateRangeFilter } from './date-range-filter/date-range-filter.component';
import { Grid } from '@astrosat/astrosat-ui';

export default ({ selectedLayer, minDate, maxDate }) => {
  const dispatch = useDispatch();

  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer.source_id)(state?.orbs),
  );

  const currentStatus = useSelector(state =>
    statusValueSelector(selectedLayer.source_id)(state?.orbs),
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
        status: status.toUpperCase(),
      }),
    );
  };

  return (
    <Grid container direction="column" style={{ gap: '1rem' }}>
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
