import React from 'react';

import { makeStyles, Grid, Typography, Link } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

const useStyles = makeStyles(theme => ({
  data: {
    display: 'flex',
  },
  singleData: {
    marginLeft: '4rem',
    alignContent: 'center',
  },
}));

const AreaOfficeContactDetails = args => {
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
          <Typography variant="h5" className={styles.data}>
            Area Office: <div className={styles.singleData}>Data here</div>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" className={styles.data}>
            Area Name: <div className={styles.singleData}>Data here</div>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" className={styles.data}>
            Telephone Number:
            <div className={styles.singleData}>Data here</div>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" className={styles.data}>
            Area Office Address:
            <div className={styles.singleData}>Data here</div>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" className={styles.data}>
            Post Code: <div className={styles.singleData}>Data here</div>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" className={styles.data}>
            Email:
            <div className={styles.singleData}>
              <Link>Test</Link>
            </div>
          </Typography>
        </Grid>
      </Grid>
      {/* </Grid> */}
    </ChartWrapper>
  );
};

export default AreaOfficeContactDetails;
