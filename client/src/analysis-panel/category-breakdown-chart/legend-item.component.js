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
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
  },
}));

export const LegendItem = ({ categoryInfo, selected }) => {
  const styles = useStyles();
  return (
    <Fade in>
      <Grid item xs>
        <ListItem dense selected={selected}>
          <ListItemIcon className={styles.listItemIcon}>
            <span
              className={styles.colorCircle}
              style={{
                backgroundColor: categoryInfo.color,
              }}
            />
          </ListItemIcon>
          <ListItemText primary={categoryInfo.category} />
        </ListItem>
      </Grid>
    </Fade>
  );
};
