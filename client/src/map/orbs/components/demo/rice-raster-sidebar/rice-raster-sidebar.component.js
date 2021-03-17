import {
  Avatar,
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
import { format, startOfYear, endOfYear } from 'date-fns';
import React from 'react';

const useStyles = makeStyles(theme => ({
  icon: { minWidth: '0' },
  avatar: { minWidth: '0', margin: theme.spacing(0, 2) },
}));

const marks = [
  new Date(2020, 2, 12),
  new Date(2020, 4, 6),
  new Date(2020, 6, 25),
].map(date => ({ value: date.getTime(), label: format(date, 'yyyy-MM') }));

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
}) => {
  const styles = useStyles();
  return (
    <>
      <Typography>Column</Typography>
      <List>
        {COLUMNS.map(({ value, label, image }) => (
          <ListItem
            key={value}
            button
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
      <Typography>Date</Typography>
      <Slider
        value={dateValue}
        onChange={onDateChange}
        min={startOfYear(new Date(2020, 0, 1)).getTime()}
        max={endOfYear(new Date(2020, 0, 1)).getTime()}
        marks={marks}
        step={null}
      />
    </>
  );
};
