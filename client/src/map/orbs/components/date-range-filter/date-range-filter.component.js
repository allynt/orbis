import { Grid, IconButton, makeStyles, Paper } from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateRange, Replay } from '@material-ui/icons';
import { DateRangePicker } from 'components/date-range-picker/date-range-picker.component';
import { addDays, endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { dateStringToDate } from 'utils/dates';
import { date, FIELD_NAMES } from 'utils/validators';
import * as yup from 'yup';

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

const placeholder = theme => ({
  color: 'currentColor',
  opacity: theme.palette.type === 'light' ? 0.42 : 0.5,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
});

const useStyles = makeStyles(theme => ({
  paper: {
    color: theme.palette.text.secondary,
  },
  input: {
    margin: '0 auto',
    fontSize: theme.typography.fontSize,
    font: 'inherit',
    color: 'currentColor',
    border: 0,
    padding: theme.spacing(2, 1),
    width: '100%',
    '&::-webkit-input-placeholder': placeholder(theme),
    '&::-moz-placeholder': placeholder(theme), // Firefox 19+
    '&:-ms-input-placeholder': placeholder(theme), // IE 11
    '&::-ms-input-placeholder': placeholder(theme), // Edge
    '&:focus': {
      outline: 0,
    },
  },
}));

/**
 * @param {{
 *  onSubmit: (values: {startDate?: string, endDate?: string}) => void
 *  minDate?: string
 *  maxDate?: string
 * }} props
 */
export const DateRangeFilter = ({
  onSubmit: onSubmitProp,
  minDate,
  maxDate,
}) => {
  const styles = useStyles();
  const { register, handleSubmit, setValue, errors } = useForm({
    mode: 'onChange',
    context: { minDate, maxDate },
    resolver: yupResolver(schema),
  });
  /** @type {[{startDate: Date, endDate: Date} | undefined, React.Dispatch<{startDate: Date, endDate: Date}>]} */
  const [dateRepresentation, setDateRepresentation] = useState();

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
  };

  return (
    <form onChange={handleSubmit(onSubmit)}>
      <Grid
        container
        justify="center"
        alignItems="center"
        component={Paper}
        className={styles.paper}
      >
        <Grid item xs>
          <IconButton color="inherit">
            <DateRange />
          </IconButton>
        </Grid>
        <Grid item xs={4} container justify="center">
          <input
            ref={register}
            name={FIELD_NAMES.startDate}
            className={styles.input}
            placeholder="DD/MM/YYYY"
            aria-label="Start Date"
          />
        </Grid>
        <Grid item xs>
          -
        </Grid>
        <Grid item xs={4} container justify="center">
          <input
            ref={register}
            name={FIELD_NAMES.endDate}
            className={styles.input}
            placeholder="DD/MM/YYYY"
            aria-label="End Date"
          />
        </Grid>
        <Grid item xs>
          <IconButton color="inherit">
            <Replay />
          </IconButton>
        </Grid>
      </Grid>
      {/* <TextField
        id={FIELD_NAMES.startDate}
        name={FIELD_NAMES.startDate}
        label="Start Date"
        placeholder="DD/MM/YYYY"
        inputRef={register}
        InputLabelProps={{ shrink: true }}
        error={!!errors.startDate}
        helperText={errors.startDate?.message}
      />
      <TextField
        id={FIELD_NAMES.endDate}
        name={FIELD_NAMES.endDate}
        label="End Date"
        placeholder="DD/MM/YYYY"
        inputRef={register}
        InputLabelProps={{ shrink: true }}
        error={!!errors.endDate}
        helperText={errors.endDate?.message}
      /> */}
      <DateRangePicker
        onApply={handleDateRangePickerApply}
        initialRange={dateRepresentation}
      />
    </form>
  );
};
