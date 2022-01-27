import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { filterValueSelector, setFilterValue } from '../layers.slice';
import { DropdownFilter } from './dropdown-filter/dropdown-filter.component';

const Filter = ({ selectedLayer, options, defaultValue, label }) => {
  const dispatch = useDispatch();

  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer.source_id)(state?.orbs),
  );

  const handleChange = status =>
    dispatch(
      setFilterValue({
        key: selectedLayer.source_id,
        filterValue: { ...filterValue, status: status.toUpperCase() },
      }),
    );

  return (
    <DropdownFilter
      value={filterValue?.status}
      options={options}
      defaultValue={defaultValue}
      label={label}
      onChange={handleChange}
    />
  );
};

export default Filter;
