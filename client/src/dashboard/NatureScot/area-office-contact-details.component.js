import React from 'react';

import { makeStyles, Grid, Link } from '@astrosat/astrosat-ui';

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

const AreaOfficeContactDetails = ({ data }) => {
  const styles = useStyles();
  const address = data[0];
  const mailto = `mailto:${address.email}`;
  return (
    <ChartWrapper title="Area Office Contact Details">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        spacing={1}
      >
        <Grid item xs={6}>
          <div className={styles.label}>Area Office :</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.value}>{address.areaOffice}</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.label}>Area Name :</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.value}>{address.areaName}</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.label}>Telephone Number :</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.value}>{address.telephoneNumber}</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.label}>Area Office Address :</div>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="row" className={styles.value}>
            {address.areaOfficeAddress.map((item, index) => (
              <div key="${index}">{item}</div>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.label}>Postcode :</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.value}>{address.postCode}</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.label}>Email :</div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.value}>
            <Link target="_blank" href={mailto} rel="noopener noreferrer">
              {address.email}
            </Link>
          </div>
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};

export default AreaOfficeContactDetails;
