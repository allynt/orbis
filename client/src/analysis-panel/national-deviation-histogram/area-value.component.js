import React from 'react';

import { Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

const useStyles = makeStyles({
  italic: {
    fontStyle: 'italic',
  },
});

/**
 * @param {{
 *  value: number
 *  aggregated?: boolean
 *  aggregationLabel?: string
 * }} props
 */
export const AreaValue = ({ value, aggregated = false, aggregationLabel }) => {
  const styles = useStyles();

  return (
    <>
      <Grid item>
        <Typography className={styles.italic} variant="h4" component="p">
          {aggregated ? aggregationLabel : 'Value'} of selected area
          {aggregated ? 's' : ''}:
        </Typography>
      </Grid>
      <Grid item>
        <Typography className={styles.italic}>{value}</Typography>
      </Grid>
    </>
  );
};
