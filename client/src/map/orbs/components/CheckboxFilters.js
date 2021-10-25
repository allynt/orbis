import React from 'react';

import { useSelector } from 'react-redux';

import { logProperty } from 'data-layers/data-layers.slice';
import { filterValueSelector, setFilterValue } from 'map/orbs/layers.slice';

import {
  CheckboxFilters,
  isPropertyOff,
} from './checkbox-filters/checkbox-filters.component';

/**
 *  @type {import("typings").SidebarComponent<{
 *  filters: {value: any, label?: string, icon?: string}[]
 *  color?: string
 *  colorMap?: import('typings').ColorMap
 *  iconColor?: string}>}
 */
export default ({ dispatch, selectedLayer, ...rest }) => {
  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer?.source_id)(state?.orbs),
  );

  /**
   * @param {any} value
   */
  const handleChange = (newFilterValue, value, checked) => {
    const { source_id } = selectedLayer;

    dispatch(setFilterValue({ key: source_id, filterValue: newFilterValue }));
    dispatch(logProperty(selectedLayer, value, checked));
  };

  return (
    <CheckboxFilters
      onChange={handleChange}
      filterValue={filterValue}
      {...rest}
    />
  );
};
