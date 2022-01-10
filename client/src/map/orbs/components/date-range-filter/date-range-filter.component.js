import React, { useEffect, useState } from 'react';

import {
  Fade,
  makeStyles,
  Tooltip,
  InputLabel,
  Typography,
  Well,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { endOfDay, startOfDay } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DateRangeInput, DateRangePicker } from 'components';
import {
  dateStringToDate,
  formatDate,
  stringDateRangeToDateRange,
} from 'utils/dates';
import { date, FIELD_NAMES } from 'utils/validators';

/**
 * @template T
 * @typedef {import('typings').DateRange<T>} DateRange
 */

const schema = yup.object({
  startDate: date,
  endDate: date,
});

const useStyles = makeStyles(theme => ({
  well: {
    marginBottom: theme.spacing(2),
  },
  tooltip: {
    maxWidth: '900px',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
  arrow: {
    color: theme.palette.background.default,
  },
}));

/**
 * @param {{
 *  onSubmit: (values: Partial<DateRange<string>>) => void
 *  minDate?: string
 *  maxDate?: string
 *  range?: DateRange<string>
 *  label?: string
 * }} props
 */
export const DateRangeFilter = ({
  onSubmit: onSubmitProp,
  minDate: minDateProp,
  maxDate: maxDateProp,
  range,
  label,
}) => {
  const minDate =
      minDateProp === 'today' ? new Date().toISOString() : minDateProp,
    maxDate = maxDateProp === 'today' ? new Date().toISOString() : maxDateProp;
  const styles = useStyles();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      [FIELD_NAMES.startDate]: range?.startDate
        ? formatDate(new Date(range.startDate))
        : undefined,
      [FIELD_NAMES.endDate]: range?.endDate
        ? formatDate(new Date(range.endDate))
        : undefined,
    },
    context: {
      minDate,
      maxDate,
    },
    resolver: yupResolver(schema),
  });

  /** @type {[DateRange<Date> | undefined, React.Dispatch<DateRange<Date>>]} */
  const [dateRepresentation, setDateRepresentation] = useState(
    range ? stringDateRangeToDateRange(range) : undefined,
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  /** @param {DateRange<string>} values */
  const onSubmit = values => {
    setDateRepresentation(stringDateRangeToDateRange(values));
    const { startDate, endDate } = values;
    onSubmitProp({
      startDate: !!startDate
        ? startOfDay(dateStringToDate(startDate)).toISOString()
        : undefined,
      endDate: !!endDate
        ? endOfDay(dateStringToDate(endDate)).toISOString()
        : undefined,
    });
  };

  /** @param {DateRange<Date>} range */
  const handleDateRangePickerApply = range => {
    setValue(FIELD_NAMES.startDate, formatDate(range[FIELD_NAMES.startDate]), {
      shouldValidate: true,
    });
    setValue(FIELD_NAMES.endDate, formatDate(range[FIELD_NAMES.endDate]), {
      shouldValidate: true,
    });
    handleSubmit(onSubmit)();
    setPickerOpen(false);
  };

  const handleDateRangeClick = () => setPickerOpen(open => !open);

  const handleResetClick = () => {
    setDateRepresentation(undefined);
    setValue(FIELD_NAMES.startDate, undefined);
    setValue(FIELD_NAMES.endDate, undefined);
    onSubmitProp({ startDate: undefined, endDate: undefined });
  };

  useEffect(() => {
    if (range) {
      const dateRange = stringDateRangeToDateRange(range);
      setValue(
        FIELD_NAMES.startDate,
        formatDate(dateRange[FIELD_NAMES.startDate]),
        {
          shouldValidate: true,
        },
      );
      setValue(
        FIELD_NAMES.endDate,
        formatDate(dateRange[FIELD_NAMES.endDate]),
        {
          shouldValidate: true,
        },
      );
      setDateRepresentation(dateRange);
    }
  }, [range, setValue]);

  return (
    <Tooltip
      classes={{
        tooltip: styles.tooltip,
        arrow: styles.arrow,
      }}
      interactive
      arrow
      placement="right"
      open={pickerOpen}
      PopperProps={{
        popperOptions: {
          modifiers: {
            offset: {
              enabled: true,
              offset: '0px, 8px',
            },
          },
        },
      }}
      title={
        <DateRangePicker
          minDate={minDate && new Date(minDate)}
          maxDate={maxDate && new Date(maxDate)}
          onApply={handleDateRangePickerApply}
          onClose={() => setPickerOpen(false)}
          initialRange={dateRepresentation}
        />
      }
    >
      <form onChange={handleSubmit(onSubmit)}>
        {label ? (
          <InputLabel shrink color="secondary">
            {label}
          </InputLabel>
        ) : null}
        <DateRangeInput
          register={register}
          onDateRangeClick={handleDateRangeClick}
          onResetClick={handleResetClick}
        />
        {!!errors[FIELD_NAMES.startDate] || !!errors[FIELD_NAMES.endDate] ? (
          <Fade in>
            <Well className={styles.well} severity="error">
              <Typography>
                {errors[FIELD_NAMES.startDate]?.message ||
                  errors[FIELD_NAMES.endDate]?.message}
              </Typography>
            </Well>
          </Fade>
        ) : null}
      </form>
    </Tooltip>
  );
};
