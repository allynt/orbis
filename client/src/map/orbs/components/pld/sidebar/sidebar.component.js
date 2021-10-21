import * as React from 'react';

import { Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

import CheckboxFilters from 'map/orbs/components/CheckboxFilters';
import DateRangeFilter from 'map/orbs/components/DateRangeFilter';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
}));

export const PldSidebarComponent = ({
  selectedLayer,
  dispatch,
  color,
  constructionPhaseFilters,
  developmentTypeFilters,
  iconColor,
}) => {
  const styles = useStyles();

  return (
    <Grid className={styles.wrapper} container spacing={2}>
      <Grid item xs={11}>
        <Typography variant="h4">Date Range</Typography>
        <DateRangeFilter maxDate="today" selectedLayer={selectedLayer} />
      </Grid>
      <Grid item xs={11}>
        <Typography variant="h4">Construction Phase</Typography>
        <CheckboxFilters
          dispatch={dispatch}
          selectedLayer={selectedLayer}
          filters={constructionPhaseFilters}
        />
      </Grid>
      <Grid item xs={11}>
        <Typography variant="h4">Development Type</Typography>
        <CheckboxFilters
          dispatch={dispatch}
          selectedLayer={selectedLayer}
          color={color}
          filters={developmentTypeFilters}
          iconColor={iconColor}
        />
      </Grid>
    </Grid>
  );
};
