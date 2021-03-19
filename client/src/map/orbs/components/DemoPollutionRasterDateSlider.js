import { endOfYear, format, startOfYear } from 'date-fns';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../orbReducer';
import { DateStepper } from './date-stepper/date-stepper.component';

const DATES = [new Date(2020, 5), new Date(2020, 8)].map(date => ({
  value: date.getTime(),
  label: format(date, 'MM/yy'),
}));

/** @type {import("typings/orbis").SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const namespaceId = `${selectedLayer.authority}/${selectedLayer.namespace}/air_pollution/*`;
  const other = useSelector(state => otherSelector(namespaceId)(state.orbs));

  return (
    <DateStepper
      dates={DATES}
      defaultValue={DATES[0].value}
      value={other?.date}
      onChange={(_, date) =>
        dispatch(
          setOther({
            source_id: namespaceId,
            other: { ...other, date },
          }),
        )
      }
      min={startOfYear(new Date(2020, 0, 1)).getTime()}
      max={endOfYear(new Date(2020, 0, 1)).getTime()}
    />
  );
};
