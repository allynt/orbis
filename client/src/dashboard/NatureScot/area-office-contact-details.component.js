import React from 'react';

import { makeStyles, Grid, Typography, Link } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

const useStyles = makeStyles(theme => ({}));

const AreaOfficeContactDetails = () => {
  const styles = useStyles({});
  return (
    <ChartWrapper title="Area Office Contact Detail">
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        spacing={2}
      >
        {/* <Grid item container> */}
        <Grid item xs={6}>
          <Typography variant="h4">Area Office:</Typography>
          <Typography align="center">Data here</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Area Name: </Typography>
          <Typography align="center">Data here</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Telephone Number:</Typography>
          <Typography align="center">Data here</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Area Office Address:</Typography>
          <Typography align="center">Data here</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Post Code</Typography>
          <Typography align="center">Data here</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Email:</Typography>
          <Typography align="center">
            <Link target="_blank" href="" rel="noopener noreferrer">
              test@test.com
            </Link>
          </Typography>
        </Grid>
      </Grid>
      {/* </Grid> */}
    </ChartWrapper>
  );
};

export default AreaOfficeContactDetails;
