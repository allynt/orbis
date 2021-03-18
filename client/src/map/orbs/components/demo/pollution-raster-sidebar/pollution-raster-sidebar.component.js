import React, { useEffect, useState } from 'react';
import {
  Grid,
  List,
  ListItem,
  Typography,
  ListItemIcon,
  Radio,
  ListItemText,
  IconButton,
  Slider,
  makeStyles,
} from '@astrosat/astrosat-ui';
import { Pause, PlayArrow } from '@material-ui/icons';
import { startOfYear, endOfYear, format } from 'date-fns';
import { findIndex } from 'lodash';

const GASSES = [
  { value: 'no2', label: 'NO2' },
  { value: 'co', label: 'CO' },
];

const useStyles = makeStyles(theme => ({
  grid: {
    marginBottom: theme.spacing(2),
  },
  icon: { minWidth: '0' },
  avatar: { minWidth: '0', margin: theme.spacing(0, 2) },
}));

const marks = [new Date(2020, 5), new Date(2020, 8)].map(date => ({
  value: date.getTime(),
  label: format(date, 'MM/yy'),
}));

export const PollutionRasterSidebar = ({
  gas = 'no2',
  onGasClick,
  dateValue = marks[0].value,
  onDateChange,
}) => {
  const styles = useStyles();

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const next =
        marks[findIndex(marks, { value: dateValue }) + 1]?.value ||
        marks[0].value;
      const timeout = setTimeout(() => {
        onDateChange({}, next);
      }, 1300);
      return () => clearTimeout(timeout);
    }
  }, [dateValue, isPlaying, onDateChange]);

  return (
    <Grid className={styles.grid} container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="p">
          Gas
        </Typography>
        <List>
          {GASSES.map(({ value, label }) => (
            <ListItem
              key={value}
              button
              disabled={isPlaying}
              onClick={() => onGasClick(value)}
              selected={gas === value}
            >
              <ListItemIcon className={styles.icon}>
                <Radio tabIndex={-1} checked={gas === value} />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" component="p">
          Date
        </Typography>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <IconButton color="primary" onClick={() => setIsPlaying(c => !c)}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Grid>
          <Grid item xs>
            <Slider
              style={{ marginTop: '20px' }}
              value={dateValue}
              onChange={onDateChange}
              min={startOfYear(new Date(2020, 0, 1)).getTime()}
              max={endOfYear(new Date(2020, 0, 1)).getTime()}
              marks={marks}
              step={null}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
