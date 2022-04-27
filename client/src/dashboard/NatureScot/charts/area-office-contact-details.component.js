import React from 'react';

import {
  makeStyles,
  Grid,
  Link,
  Typography,
  Skeleton,
} from '@astrosat/astrosat-ui';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from '../../charts/chart-wrapper.component';

const NO_DATA = 'No Data';

const useStyles = makeStyles(theme => ({
  grid: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
  },
}));

const skeletonStyles = makeStyles(theme => ({
  areas: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px solid #333f48',
    marginTop: '2rem',
  },
}));

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
      <Grid
        container
        justifyContent="space-between"
        spacing={1}
        className={styles.grid}
      >
        <Grid item xs={6}>
          <Typography variant="h4">Area Office :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{area_office ?? NO_DATA}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Area Name :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{area_name ?? NO_DATA}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Telephone Number :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{telephone_number ?? NO_DATA}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Area Office Address :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="column">
            {area_office_address?.map(item => (
              <Typography key={item}>{item}</Typography>
            )) ?? <Typography>{NO_DATA}</Typography>}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Postcode :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{postcode ?? NO_DATA}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Email :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.value}>
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

export const AreaOfficeContactDetailsSkeleton = () => {
  const styles = skeletonStyles();
  return (
    <ChartWrapperSkeleton>
      <div className={styles.areas}>
        <Skeleton variant="rect" width={'100%'} height={'15rem'} />
      </div>
    </ChartWrapperSkeleton>
  );
};

export default AreaOfficeContactDetails;
