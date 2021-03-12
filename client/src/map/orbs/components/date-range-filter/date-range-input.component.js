import { IconButton } from '@astrosat/astrosat-ui';
import { Grid, makeStyles, Paper } from '@material-ui/core';
import { DateRange, Replay } from '@material-ui/icons';
import React from 'react';
import { FIELD_NAMES } from 'utils/validators';

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
}));

/**
 * @param {{
 *   register: any
 *   onDateRangeClick: React.MouseEventHandler<HTMLButtonElement>
 *   onResetClick: React.MouseEventHandler<HTMLButtonElement>
 * }} props
 */
export const DateRangeInput = ({
  register,
  onDateRangeClick,
  onResetClick,
}) => {
  const styles = useStyles();

  const inputProps = {
    ref: register,
    className: styles.input,
    placeholder: 'DD/MM/YYYY',
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      component={Paper}
      className={styles.paper}
    >
      <Grid item xs>
        <IconButton color="inherit" size="small" onClick={onDateRangeClick}>
          <DateRange titleAccess="Show date picker" />
        </IconButton>
      </Grid>
      <Grid item xs={4} container justify="center">
        <input
          {...inputProps}
          name={FIELD_NAMES.startDate}
          aria-label="Start Date"
        />
      </Grid>
      <Grid item xs className={styles.separator}>
        -
      </Grid>
      <Grid item xs={4} container justify="center">
        <input
          {...inputProps}
          name={FIELD_NAMES.endDate}
          aria-label="End Date"
        />
      </Grid>
      <Grid item xs container justify="flex-end">
        <IconButton color="inherit" size="small" onClick={onResetClick}>
          <Replay titleAccess="Reset" />
        </IconButton>
      </Grid>
    </Grid>
  );
};
