import React from 'react';

import { Grid, withWidth } from '@astrosat/astrosat-ui';

import { Form } from './form/form.component';
import { Info } from './info/info.component';

export const AccountDetails = withWidth()(({ width }) => (
  <Grid
    container
    spacing={width === 'lg' || width === 'xl' ? 4 : 2}
    style={{ position: 'absolute' }}
  >
    <Grid item xs={12} sm={12} md={4}>
      <Info
        organisationId="123-345-456"
        organisationName="Test Org"
        userName="Josh Smity"
      />
    </Grid>
    <Grid item xs={12} sm={12} md={8}>
      <Form />
    </Grid>
  </Grid>
));
