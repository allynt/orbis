import React, { useEffect, useState } from 'react';

import {
  Grid,
  IconButton,
  makeStyles,
  Slider,
  Typography,
  Tooltip,
  alpha,
  Box,
} from '@astrosat/astrosat-ui';

import { Pause, PlayArrow } from '@material-ui/icons';
import { format } from 'date-fns';
import { findIndex } from 'lodash';

const useStyles = makeStyles(theme => ({
  grid: {
    marginRight: '1ch',
    marginBottom: theme.spacing(4),
  },
  slider: {
    marginTop: theme.spacing(1.5),
  },
  markLabel: {
    color: alpha(theme.palette.text.primary, 0.5),
    transform: 'rotate(-90deg) translate(-1em, -2em)',
  },
  markLabelActive: {
    color: theme.palette.text.primary,
  },
}));

const ValueLabelComponent = props => {
  const { children, open, value } = props;

  return (
    <Tooltip
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={value}
      arrow
    >
      {children}
    </Tooltip>
  );
};

/**
 * @param {{
 *  dates: {value: number, label?: string}[]
 *  defaultValue?: number,
 *  value: number,
 *  onChange: (event: React.ChangeEvent<{}>, date: number) => void
 *  min?: number
 *  max?: number
 * }} props
 */
export const DateStepper = ({
  dates,
  defaultValue,
  value,
  onChange,
  min,
  max,
}) => {
  const styles = useStyles();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const next =
        dates[findIndex(dates, { value }) + 1]?.value || dates[0].value;
      const timeout = setTimeout(() => {
        onChange(undefined, next);
      }, 1300);
      return () => clearTimeout(timeout);
    }
  }, [value, isPlaying, onChange, dates]);

  return (
    <Box className={styles.grid}>
      <Typography id="stepper-label">Timeseries</Typography>
      <Grid container>
        <Grid item xs={2}>
          <IconButton color="primary" onClick={() => setIsPlaying(c => !c)}>
            {isPlaying ? (
              <Pause titleAccess="pause" />
            ) : (
              <PlayArrow titleAccess="play" />
            )}
          </IconButton>
        </Grid>
        <Grid item xs>
          <Slider
            aria-labelledby="stepper-label"
            ValueLabelComponent={ValueLabelComponent}
            valueLabelDisplay={isPlaying ? 'on' : 'auto'}
            valueLabelFormat={v => format(new Date(v), 'dd/MM/yy')}
            className={styles.slider}
            classes={{
              markLabel: styles.markLabel,
              markLabelActive: styles.markLabelActive,
            }}
            value={value || defaultValue}
            onChange={onChange}
            min={min}
            max={max}
            marks={dates}
            step={null}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
