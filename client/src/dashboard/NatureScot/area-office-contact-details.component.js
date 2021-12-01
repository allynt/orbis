import React from 'react';

import { makeStyles, Grid, Link, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

const useStyles = makeStyles(theme => ({}));

const AreaOfficeContactDetails = ({ contactDetails }) => {
  const styles = useStyles();
  return (
    <ChartWrapper title="Area Office Contact Details">
      <Grid container justifyContent="space-between" spacing={1}>
        <Grid item xs={6}>
          <Typography variant="h4">Area Office :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p">{contactDetails.areaOffice}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Area Name :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p">{contactDetails.areaName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Telephone Number :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p">{contactDetails.telephoneNumber}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Area Office Address :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="column">
            {contactDetails.areaOfficeAddress.map(item => (
              <Grid key={item} item>
                <Typography variant="p" key={item}>
                  {item}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Postcode :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p">{contactDetails.postCode}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Email :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p" className={styles.value}>
            <Link
              target="_blank"
              href={`mailto:${contactDetails.email}`}
              rel="noopener noreferrer"
            >
              {contactDetails.email}
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};

export default AreaOfficeContactDetails;
