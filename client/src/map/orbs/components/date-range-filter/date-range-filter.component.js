import {
  Fade,
  makeStyles,
  Tooltip,
  Typography,
  Well,
} from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateRangePicker } from 'components';
import { addDays, endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { dateStringToDate } from 'utils/dates';
import { date, FIELD_NAMES } from 'utils/validators';
import * as yup from 'yup';
import { DateRangeInput } from './date-range-input.component';

/**
 * @param {{startDate?: string, endDate?: string}} range
 * @returns {{startDate: Date, endDate: Date}}
 */
const toDates = range => {
  let dateRep = {};
  const { startDate, endDate } = range;
  if (!startDate && !endDate) return undefined;
  if (startDate) {
    dateRep.startDate = dateStringToDate(startDate);
  }
  if (endDate) {
    dateRep.endDate = dateStringToDate(endDate);
  }
  if (!startDate && endDate) {
    dateRep.startDate = subDays(dateRep.endDate, 30);
  }
  if (!endDate && startDate) {
    dateRep.endDate = addDays(dateRep.startDate, 30);
  }
  return dateRep;
};

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
 *  onSubmit: (values: {startDate?: string, endDate?: string}) => void
 *  minDate?: string
 *  maxDate?: string
 *  range?: {startDate: string, endDate: string}
 * }} props
 */
export const DateRangeFilter = ({
  onSubmit: onSubmitProp,
  minDate: minDateProp,
  maxDate: maxDateProp,
  range,
}) => {
  const minDate =
      minDateProp === 'today' ? new Date().toISOString() : minDateProp,
    maxDate = maxDateProp === 'today' ? new Date().toISOString() : maxDateProp;
  const styles = useStyles();
  const { register, handleSubmit, setValue, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      [FIELD_NAMES.startDate]: range?.startDate
        ? format(new Date(range.startDate), 'dd/MM/yyyy')
        : undefined,
      [FIELD_NAMES.endDate]: range?.endDate
        ? format(new Date(range.endDate), 'dd/MM/yyyy')
        : undefined,
    },
    context: {
      minDate,
      maxDate,
    },
    resolver: yupResolver(schema),
  });
  /** @type {[{startDate: Date, endDate: Date} | undefined, React.Dispatch<{startDate: Date, endDate: Date}>]} */
  const [dateRepresentation, setDateRepresentation] = useState(
    range
      ? toDates({
          startDate:
            range.startDate && format(new Date(range.startDate), 'dd/MM/yyyy'),
          endDate:
            range.endDate && format(new Date(range.endDate), 'dd/MM/yyyy'),
        })
      : undefined,
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  const onSubmit = ({ startDate, endDate }) => {
    setDateRepresentation(toDates({ startDate, endDate }));
    onSubmitProp({
      startDate: !!startDate
        ? startOfDay(dateStringToDate(startDate)).toISOString()
        : undefined,
      endDate: !!endDate
        ? endOfDay(dateStringToDate(endDate)).toISOString()
        : undefined,
    });
  };

  const handleDateRangePickerApply = range => {
    setValue(
      FIELD_NAMES.startDate,
      format(range[FIELD_NAMES.startDate], 'dd/MM/yyyy'),
      { shouldValidate: true },
    );
    setValue(
      FIELD_NAMES.endDate,
      format(range[FIELD_NAMES.endDate], 'dd/MM/yyyy'),
      { shouldValidate: true },
    );
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
          minDate={minDate}
          maxDate={maxDate}
          onApply={handleDateRangePickerApply}
          initialRange={dateRepresentation}
        />
      }
    >
      <form onChange={handleSubmit(onSubmit)}>
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
        <DateRangeInput
          register={register}
          onDateRangeClick={handleDateRangeClick}
          onResetClick={handleResetClick}
        />
      </form>
    </Tooltip>
  );
};
