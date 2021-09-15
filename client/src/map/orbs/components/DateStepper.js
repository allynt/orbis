import React from 'react';

import { maxBy, minBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { otherSelector, setOther } from '../layers.slice';
import { DateStepper } from './date-stepper/date-stepper.component';

/**
 * @type {import('typings').SidebarComponent<{
 *  dates: string[]
 *  defaultValue?: string
 *  min?: string
 *  max?: string
 *  stateKey?: string
 * }>}
 * */
export default ({
  selectedLayer,
  dates: datesProp,
  defaultValue,
  stateKey = selectedLayer.source_id,
  min,
  max,
}) => {
  const dispatch = useDispatch();
  const dates = datesProp.map(dateString => {
    const date = new Date(dateString);
    return { value: date.getTime() };
  });
  const other = useSelector(state => otherSelector(stateKey)(state.orbs));

  return (
    <DateStepper
      dates={dates}
      defaultValue={defaultValue ? new Date(defaultValue).getTime() : undefined}
      min={min ? new Date(min).getTime() : minBy(dates, 'value').value}
      max={max ? new Date(max).getTime() : maxBy(dates, 'value').value}
      value={other?.date}
      onChange={(_, date) =>
        dispatch(
          setOther({
            key: stateKey,
            other: { ...other, date },
          }),
        )
      }
    />
  );
};
