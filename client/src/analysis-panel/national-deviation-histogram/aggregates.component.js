import React, { useState } from 'react';

import {
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  select: {
    padding: theme.spacing(1),
  },
}));

/**
 * @param {{
 *  aggregates: import('typings/orbis').ContinuousProperty['aggregates']
 *  aggregationLabel: string
 * }} props
 */
export const Aggregates = ({ aggregates, aggregationLabel }) => {
  const [selectedAggregateArea, setSelectedAggregateArea] = useState('GB');
  const styles = useStyles();

  return (
    <>
      <Grid item>
        <Typography variant="h4" component="p">
          {aggregationLabel} of all areas in
        </Typography>
      </Grid>

      <Grid item>
        <Select
          classes={{
            select: styles.select,
          }}
          fullWidth={false}
          inputProps={{ 'aria-label': 'Aggregation Area' }}
          value={selectedAggregateArea}
          onChange={e => setSelectedAggregateArea(e.target.value)}
        >
          {Object.keys(aggregates).map(area => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item>
        <Typography>:</Typography>
      </Grid>

      <Grid item>
        <Typography>{aggregates?.[selectedAggregateArea]}</Typography>
      </Grid>
    </>
  );
};
