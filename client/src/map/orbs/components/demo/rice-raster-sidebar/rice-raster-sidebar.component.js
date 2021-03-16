import { List, ListItem, ListItemText, Slider } from '@astrosat/astrosat-ui';
import { format, startOfYear, endOfYear } from 'date-fns';
import React from 'react';

const marks = [
  new Date(2020, 2, 12),
  new Date(2020, 4, 6),
  new Date(2020, 6, 25),
].map(date => ({ value: date.getTime(), label: format(date, 'yyyy-MM') }));

export const RiceRasterSidebarComponent = ({
  dateValue = marks[0].value,
  onDateChange,
}) => {
  return (
    <>
      <List>
        <ListItem>
          <ListItemText primary="RGB" />
        </ListItem>
        <ListItem>
          <ListItemText primary="NDVI" />
        </ListItem>
        <ListItem>
          <ListItemText primary="NDWI" />
        </ListItem>
      </List>
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
