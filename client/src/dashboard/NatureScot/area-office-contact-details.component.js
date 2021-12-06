import React from 'react';

import { makeStyles, Grid, Link, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

const NO_DATA = 'No Data';

const useStyles = makeStyles(theme => ({}));

const AreaOfficeContactDetails = ({ contactDetails }) => {
  const styles = useStyles();

  if (!contactDetails) return null;

  const {
    area_office,
    area_name,
    telephone_number,
    area_office_address,
    postcode,
    email,
  } = contactDetails;

  // maybe inside destructuring will stop no data flash

  return (
    <ChartWrapper title="Area Office Contact Details">
      <Grid container justifyContent="space-between" spacing={1}>
        {/* <Grid item xs={6}>
          <Typography variant="h4">Area Office :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p">{area_office ?? NO_DATA}</Typography>
        </Grid> */}
        <Grid item xs={6}>
          <Typography variant="h4">Area Name :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p">{area_name ?? NO_DATA}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Telephone Number :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p">{telephone_number ?? NO_DATA}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Area Office Address :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="column">
            {area_office_address?.map(item => (
              <Grid key={item} item>
                <Typography variant="p" key={item}>
                  {item}
                </Typography>
              </Grid>
            )) ?? NO_DATA}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Postcode :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p">{postcode ?? NO_DATA}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Email :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p" className={styles.value}>
            {!!email ? (
              <Link
                target="_blank"
                href={`mailto:${email}`}
                rel="noopener noreferrer"
              >
                {email}
              </Link>
            ) : (
              NO_DATA
            )}
          </Typography>
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};

export default AreaOfficeContactDetails;
