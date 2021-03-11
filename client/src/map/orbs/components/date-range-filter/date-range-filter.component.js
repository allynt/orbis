import {
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
  Well,
} from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateRange, Replay } from '@material-ui/icons';
import { DateRangePicker } from 'components';
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
  well: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    color: theme.palette.text.secondary,
    boxShadow: 'none',
  },
  separator: {
    textAlign: 'center',
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

        <Grid
          container
          justify="center"
          alignItems="center"
          component={Paper}
          className={styles.paper}
        >
          <Grid item xs>
            <IconButton
              color="inherit"
              size="small"
              onClick={handleDateRangeClick}
            >
              <DateRange titleAccess="Show date picker" />
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
          <Grid item xs className={styles.separator}>
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
          <Grid item xs container justify="flex-end">
            <IconButton color="inherit" size="small">
              <Replay />
            </IconButton>
          </Grid>
        </Grid>
      </form>
    </Tooltip>
  );
};
