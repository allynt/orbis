import React from 'react';

import { makeStyles, Grid, Link, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

const useStyles = makeStyles(theme => ({
  label: {
    fontWeight: 600,
    fontSize: '0.8rem',
  },
  value: {
    fontWeight: 100,
    width: '100%',
    display: 'block',
    fontSize: '0.8rem',
  },
}));

const AreaOfficeContactDetails = ({ contactDetails }) => {
  const styles = useStyles();
  const address = contactDetails[0];
  return (
    <ChartWrapper title="Area Office Contact Details">
      <Grid container justifyContent="space-between" spacing={1}>
        <Grid item xs={6}>
          <Typography className={styles.label}>Area Office :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.value}>{address.areaOffice}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.label}>Area Name :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.value}>{address.areaName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.label}>Telephone Number :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.value}>
            {address.telephoneNumber}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.label}>
            Area Office Address :
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="row" className={styles.value}>
            {address.areaOfficeAddress.map(item => (
              <Typography key={item}>{item}</Typography>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.label}>Postcode :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.value}>{address.postCode}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.label}>Email :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.value}>
            <Link
              target="_blank"
              href={`mailto:${address.email}`}
              rel="noopener noreferrer"
            >
              {address.email}
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};

export default AreaOfficeContactDetails;
