import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterValueSelector, setFilterValue } from '../orbReducer';
import { DateRangeFilter } from './date-range-filter/date-range-filter.component';

/** @type {import('typings/orbis').SidebarComponent<{minDate?: string, maxDate?: string}>} */
export default ({ selectedLayer, minDate, maxDate }) => {
  const dispatch = useDispatch();
  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer.source_id)(state?.orbs),
  );

  const handleSubmit = range => {
    dispatch(
      setFilterValue({
        source_id: selectedLayer.source_id,
        filterValue: range,
      }),
    );
  };

  return (
    <DateRangeFilter
      onSubmit={handleSubmit}
      minDate={minDate}
      maxDate={maxDate}
      range={filterValue}
    />
  );
};