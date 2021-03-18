import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Radio,
  Slider,
  Typography,
} from '@astrosat/astrosat-ui';
import {
  Pause,
  PlayArrow,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { format, startOfYear, endOfYear } from 'date-fns';
import { findIndex, indexOf } from 'lodash';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
  icon: { minWidth: '0' },
  avatar: { minWidth: '0', margin: theme.spacing(0, 2) },
}));

const marks = [
  new Date(2020, 2, 12),
  new Date(2020, 4, 6),
  new Date(2020, 6, 25),
].map(date => ({ value: date.getTime(), label: format(date, 'yy-MM') }));

const COLUMNS = [
  {
    value: 'rgb',
    label: 'RGB',
    image:
      'https://apps.sentinel-hub.com/eo-browser/previews/DEFAULT-THEME-bd86bc-1_TRUE_COLOR.png',
  },
  {
    value: 'ndvi',
    label: 'NDVI',
    image:
      'https://apps.sentinel-hub.com/eo-browser/previews/DEFAULT-THEME-bd86bc-3_NDVI.png',
  },
  {
    value: 'ndmi',
    label: 'NDMI',
    image:
      'https://apps.sentinel-hub.com/eo-browser/previews/DEFAULT-THEME-bd86bc-5-MOISTURE-INDEX1.png',
  },
];

export const RiceRasterSidebarComponent = ({
  dateValue = marks[0].value,
  column = 'rgb',
  onDateChange,
  onColumnClick,
  visible = true,
  onVisibilityClick,
}) => {
  const styles = useStyles();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const next =
        marks[findIndex(marks, { value: dateValue }) + 1]?.value ||
        marks[0].value;
      setTimeout(() => {
        onDateChange({}, next);
      }, 1000);
    }
  }, [dateValue, isPlaying, onDateChange]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="p">
          Column
        </Typography>
        <List>
          {COLUMNS.map(({ value, label, image }) => (
            <ListItem
              key={value}
              button
              disabled={isPlaying}
              onClick={() => onColumnClick(value)}
              selected={column === value}
            >
              <ListItemIcon className={styles.icon}>
                <Radio tabIndex={-1} checked={column === value} />
              </ListItemIcon>
              <ListItemAvatar className={styles.avatar}>
                <Avatar src={image} />
              </ListItemAvatar>
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
            <IconButton onClick={() => setIsPlaying(c => !c)}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Grid>
          <Grid item xs>
            <Slider
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
      <Grid item container justify="center">
        <Button size="small" onClick={onVisibilityClick}>
          {visible ? (
            <Visibility titleAccess="hide" />
          ) : (
            <VisibilityOff titleAccess="show" />
          )}
        </Button>
      </Grid>
    </Grid>
  );
};
