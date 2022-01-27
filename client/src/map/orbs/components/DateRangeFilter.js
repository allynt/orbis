import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { filterValueSelector, setFilterValue } from '../layers.slice';
import { DateRangeFilter } from './date-range-filter/date-range-filter.component';

/** @type {import('typings').SidebarComponent<{minDate?: string, maxDate?: string, label?: string}>} */
const Filter = ({ selectedLayer, minDate, maxDate, label }) => {
  const dispatch = useDispatch();
  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer.source_id)(state?.orbs),
  );

  const handleSubmit = range => {
    dispatch(
      setFilterValue({
        key: selectedLayer.source_id,
        filterValue: { ...filterValue, range },
      }),
    );
  };

  return (
    <DateRangeFilter
      onSubmit={handleSubmit}
      minDate={minDate}
      maxDate={maxDate}
      range={filterValue?.range}
      label={label}
    />
  );
};

export default Filter; //
