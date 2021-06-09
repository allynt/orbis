import * as React from 'react';

import {
  Fade,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  listItemIcon: {
    marginRight: theme.spacing(1),
    minWidth: 'max-content',
  },
  colorCircle: {
    backgroundColor: props => props.color,
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
  },
}));

export const LegendItem = ({ color, text, selected = false }) => {
  const styles = useStyles({ color });
  return (
    <Fade in>
      <Grid item xs={6} container alignItems="center">
        <ListItem dense selected={selected}>
          <ListItemIcon className={styles.listItemIcon}>
            <span className={styles.colorCircle} />
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      </Grid>
    </Fade>
  );
};
