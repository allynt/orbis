import {
  Grid,
  IconButton,
  makeStyles,
  Slider,
  Typography,
} from '@astrosat/astrosat-ui';
import { Pause, PlayArrow } from '@material-ui/icons';
import { findIndex } from 'lodash';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
  grid: {
    marginBottom: theme.spacing(2),
  },
  slider: {
    marginTop: theme.typography.pxToRem(20),
  },
}));

/**
 * @param {{
 *  dates: {value: number, label: string}[]
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
    <Grid className={styles.grid} container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="p">
          Date
        </Typography>
        <Grid container alignItems="center">
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
              className={styles.slider}
              value={value || defaultValue}
              onChange={onChange}
              min={min}
              max={max}
              marks={dates}
              step={null}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
