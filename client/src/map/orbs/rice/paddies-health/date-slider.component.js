import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { setDateRange } from '../rice.slice';
import './date-slider.css';

export const DateSlider = () => {
  /**
   * @type {{min: Date, max: Date}}
   */
  const dateRange = useSelector(
    state => state.orbs.rice.dateRange || state.orbs.rice.maxDateRange,
  );
  /**
   * @type {{min: Date, max: Date}}
   */
  const maxDateRange = useSelector(state => state.orbs.rice.maxDateRange);
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
      formatLabel={value => new Date(value).toUTCString()}
      draggableTrack
    />
  );
};
