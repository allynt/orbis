import React, { useState } from 'react';

import {
  Button,
  CloseIcon,
  Grid,
  makeStyles,
  Typography,
  IconButton,
} from '@astrosat/astrosat-ui';

import { endOfDay, startOfDay, subDays } from 'date-fns';
import { createStaticRanges } from 'react-date-range';

import { formatDate } from 'utils/dates';

import { StyledDateRangePicker } from './styled-date-range-picker.component';

/**
 * @template T
 * @typedef {import('typings').DateRange<T>} DateRange
 */

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: theme.typography.pxToRem(890),
    position: 'relative',
  },
  closeButton: { position: 'absolute', right: 0, top: 0 },
}));

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

/**
 * @param {{
 *  onApply: (range: DateRange<Date>) => void
 *  onClose: () => void
 *  minDate?: Date
 *  maxDate?: Date
 *  initialRange?: DateRange<Date>
 * }} props
 */
export const DateRangePicker = ({
  onApply,
  onClose,
  minDate,
  maxDate,
  initialRange = {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  },
}) => {
  const styles = useStyles();
  /** @type {[DateRange<Date> | undefined, React.Dispatch<DateRange<Date>>]} */
  const [preparedRange, setPreparedRange] = useState();

  /** @param {import('react-date-range').OnChangeProps} item */
  const handleRangeChange = item => setPreparedRange(item['range1']);

  const range = preparedRange || initialRange;

  const handleApplyClick = () => {
    if (onApply) onApply(range);
  };

  return (
    <Grid
      className={styles.container}
      container
      spacing={1}
      alignItems="center"
    >
      <IconButton className={styles.closeButton} size="small" onClick={onClose}>
        <CloseIcon fontSize="inherit" titleAccess="Close date picker" />
      </IconButton>
      <Grid item xs>
        <StyledDateRangePicker
          minDate={minDate}
          maxDate={maxDate}
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
      </Grid>
      <Grid item xs>
        <Typography align="right" color="textPrimary">
          {`${formatDate(range.startDate)} - ${formatDate(range.endDate)}`}
        </Typography>
      </Grid>
      <Grid item>
        <Button size="small" onClick={handleApplyClick}>
          Apply
        </Button>
      </Grid>
    </Grid>
  );
};
