import React from 'react';
import { useDispatch } from 'react-redux';
import { setFilterValue } from '../orbReducer';
import { DateRangeFilter } from './date-range-filter/date-range-filter.component';

/** @type {import('typings/orbis').SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();

  const handleSubmit = range => {
    dispatch(
      setFilterValue({
        source_id: selectedLayer.source_id,
        filterValue: [range.startDate, range.endDate],
      }),
    );
  };

  return <DateRangeFilter onSubmit={handleSubmit} />;
};
