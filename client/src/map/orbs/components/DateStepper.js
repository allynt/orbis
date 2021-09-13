import React from 'react';

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
      min={min ? new Date(min).getTime() : dates[0].value}
      max={max ? new Date(max).getTime() : dates[dates.length - 1].value}
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
