import React from 'react';

import { styled, Grid, Typography } from '@astrosat/astrosat-ui';

const LightText = styled('span')(({ theme }) => ({
  fontWeight: theme.typography.fontWeightLight,
}));

/**
 * @param {{label:string, value: string}} props
 */
export const DataValue = ({ label, value }) => (
  <Grid item xs={12}>
    <Typography>
      {label}: <LightText>{value}</LightText>
    </Typography>
  </Grid>
);
