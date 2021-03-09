import { Button, Typography } from '@astrosat/astrosat-ui';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useState } from 'react';
import {
  DateRangePicker as ReactDateRange,
  createStaticRanges,
} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';

const DATE_FORMAT = 'dd/MM/yyyy';

const staticRanges = createStaticRanges([
  // @ts-ignore
  {
    label: 'Today',
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
  },
  // @ts-ignore
  {
    label: 'Yesterday',
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 1)),
      endDate: endOfDay(subDays(new Date(), 1)),
    }),
  },
  // @ts-ignore
  {
    label: 'Last 7 Days',
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 7)),
      endDate: endOfDay(new Date()),
    }),
  },
  // @ts-ignore
  {
    label: 'Last 30 Days',
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 30)),
      endDate: endOfDay(new Date()),
    }),
  },
]);

export const DateRangePicker = ({
  onApply,
  initialRange = {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  },
}) => {
  const [range, setRange] = useState(initialRange);

  /**
   * @param {import('react-date-range').OnChangeProps} item
   */
  const handleRangeChange = item => setRange(item['range1']);

  const handleApplyClick = () => {
    if (onApply) onApply(range);
  };

  return (
    <>
      <ReactDateRange
        ranges={[range]}
        onChange={handleRangeChange}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        showDateDisplay={false}
        months={2}
        direction="horizontal"
        staticRanges={staticRanges}
        inputRanges={[]}
      />
      <Typography>
        {`${format(range.startDate, DATE_FORMAT)} - ${format(
          range.endDate,
          DATE_FORMAT,
        )}`}
      </Typography>
      <Button onClick={handleApplyClick}>Apply</Button>
    </>
  );
};
