import { format } from 'date-fns';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../orbReducer';
import { DateStepper } from './date-stepper/date-stepper.component';

/**
 * @type {import('typings/orbis').SidebarComponent<{
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
    return { value: date.getTime(), label: format(date, 'MM/yy') };
  });
  const other = useSelector(state => otherSelector(stateKey)(state.orbs));

  return (
    <DateStepper
      dates={dates}
      defaultValue={defaultValue ? new Date(defaultValue).getTime() : undefined}
      min={min ? new Date(min).getTime() : undefined}
      max={max ? new Date(max).getTime() : undefined}
      value={other?.date}
      onChange={(_, date) =>
        dispatch(
          setOther({
            source_id: stateKey,
            other: { ...other, date },
          }),
        )
      }
    />
  );
};
