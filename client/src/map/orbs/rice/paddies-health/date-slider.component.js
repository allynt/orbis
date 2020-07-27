import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  dateRangeSelector,
  maxDateRangeSelector,
  setDateRange,
} from '../rice.slice';
import './date-slider.css';
import { format } from 'date-fns';

export const DateSlider = () => {
  const dateRange = useSelector(dateRangeSelector);
  const maxDateRange = useSelector(maxDateRangeSelector);
  const dispatch = useDispatch();

  return (
    <InputRange
      minValue={Date.parse(maxDateRange.min)}
      maxValue={Date.parse(maxDateRange.max)}
      value={{ min: Date.parse(dateRange.min), max: Date.parse(dateRange.max) }}
      onChange={val =>
        dispatch(
          setDateRange({ min: new Date(val.min), max: new Date(val.max) }),
        )
      }
      formatLabel={value => !isNaN(value) && format(value, 'dd/MM/yyyy')}
      draggableTrack
    />
  );
};
