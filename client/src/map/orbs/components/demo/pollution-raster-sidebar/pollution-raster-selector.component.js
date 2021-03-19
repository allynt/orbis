import {
  Radio,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@astrosat/astrosat-ui';
import React from 'react';

const GASSES = [
  { value: 'no2', label: 'NO2' },
  { value: 'co', label: 'CO' },
];

const useStyles = makeStyles({
  icon: { minWidth: '0' },
});

export const PollutionRasterSelector = ({
  onChange,
  value: valueProp = 'no2',
}) => {
  const styles = useStyles();
  return (
    <List>
      {GASSES.map(({ value, label }) => (
        <ListItem
          key={value}
          button
          onClick={() => onChange(value)}
          selected={valueProp === value}
        >
          <ListItemIcon className={styles.icon}>
            <Radio tabIndex={-1} checked={valueProp === value} />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItem>
      ))}
    </List>
  );
};
