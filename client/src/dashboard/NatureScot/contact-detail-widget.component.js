import React from 'react';

import { makeStyles, Grid, Typography, Box } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

const useStyles = makeStyles(theme => ({
  header: {
    padding: '2rem',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

const contactData = {
  areaOffice: '',
  areaName: 'Dunoon',
  telephoneNumber: '',
  areaOfficeAddress: '',
  postCode: '',
  email: '',
};

const ContactDetailWidget = () => {
  const styles = useStyles({});
  return (
    <ChartWrapper title="Title">
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item xs={6}>
          <Typography variant="h5">Area Office:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">
            Area Name:
            {/* <div className={styles.header}>{contactData.areaName}</div> */}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Telephone Number:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Area Office Address:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Post Code:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Email:</Typography>
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};

export default ContactDetailWidget;
