import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  Radio,
  ListItemAvatar,
  Avatar,
  ListItemText,
  makeStyles,
} from '@astrosat/astrosat-ui';

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

const useStyles = makeStyles(theme => ({
  icon: { minWidth: '0' },
  avatar: { minWidth: '0', margin: theme.spacing(0, 2) },
}));

export const RiceRasterSelector = ({ onChange, value: valueProp = 'rgb' }) => {
  const styles = useStyles();
  return (
    <List>
      {COLUMNS.map(({ value, label, image }) => (
        <ListItem
          key={value}
          button
          onClick={() => onChange(value)}
          selected={valueProp === value}
        >
          <ListItemIcon className={styles.icon}>
            <Radio tabIndex={-1} checked={valueProp === value} />
          </ListItemIcon>
          <ListItemAvatar className={styles.avatar}>
            <Avatar src={image} />
          </ListItemAvatar>
          <ListItemText primary={label} />
        </ListItem>
      ))}
    </List>
  );
};
