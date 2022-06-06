import React from 'react';

import { Grid, Skeleton, makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { format } from 'date-fns';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from 'dashboard/charts/chart-wrapper.component';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    '& > *': {
      width: '50%',
      textAlign: 'start',
    },
  },
  nestedComponent: {
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
}));

/**
 * @param {{data: object}} props
 */
const DataWrapper = ({ data }) => {
  const styles = useStyles();
  return Object.entries(data).map(([key, value]) => {
    const isNested = !!value && typeof value === 'object';
    return (
      <div
        key={key}
        className={clsx(
          styles.content,
          isNested ? styles.nestedComponent : null,
        )}
      >
        <div className={styles.label}>{key}: </div>
        <div>{value ?? '-'}</div>
      </div>
    );
  });
};

/** @param {string} date */
const formatDate = date => format(new Date(date), 'dd/MM/yyyy');

/**
 * @param {{data: object}} props
 */
const ContentWrapper = ({ data }) => {
  const styles = useStyles({});
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      className={styles.contentWrapper}
    >
      <DataWrapper data={data} />
    </Grid>
  );
};

/**
 * @param {{ selectedFeature: object }} props
 */
const ProjectInfo = ({ selectedFeature }) => (
  <Grid container alignItems="flex-start" wrap="wrap" spacing={4}>
    <Grid item xs={6}>
      <ChartWrapper
        title="Reference Numbers"
        info="Data source: LBWF Tascomi Planning"
      >
        <ContentWrapper
          data={{
            'Planning Application Reference Number':
              selectedFeature['Application ID'],
            UPRN: selectedFeature['UPRN'],
          }}
        />
      </ChartWrapper>
    </Grid>

    <Grid item xs={6}>
      <ChartWrapper title="Location" info="Data source: LBWF Tascomi Planning">
        <ContentWrapper
          data={{
            Address: selectedFeature['Address'],
            'Co-ordinates': selectedFeature['Site co-ordinates'],
          }}
        />
      </ChartWrapper>
    </Grid>

    <Grid item xs={6}>
      <ChartWrapper
        title="Site Details"
        info="Data source: LBWF Tascomi Planning"
      >
        <ContentWrapper
          data={{
            'Applicant Name': selectedFeature['Applicant name'],
            "Applicant's Company Name":
              selectedFeature["Applicant's company name"],
            Description: selectedFeature.Description,
            'Number of Units (Gross)':
              selectedFeature['Number of units (Gross)'],
            'Number of Units (Net)': selectedFeature['Number of units (Net)'],
            'Site Tenure Mix (Gross)': !!selectedFeature[
              'Site Tenure Mix (Gross)'
            ] ? (
              <DataWrapper data={selectedFeature['Site Tenure Mix (Gross)']} />
            ) : null,
            'Site Tenure Mix (Net)': !!selectedFeature[
              'Site Tenure Mix (Net)'
            ] ? (
              <DataWrapper data={selectedFeature['Site Tenure Mix (Net)']} />
            ) : null,
            'No. Bedrooms': null,
          }}
        />
      </ChartWrapper>
    </Grid>

    <Grid item xs={6}>
      <ChartWrapper
        title="Dates"
        info="Data sources: Tascomi, and Exacom ('S106 agreement date', 'S106 discharged date')"
      >
        <ContentWrapper
          data={{
            'Received Date': !!selectedFeature['Received date']
              ? formatDate(selectedFeature['Received date'])
              : null,
            'Committee Date': !!selectedFeature['Committee date']
              ? formatDate(selectedFeature['Committee date'])
              : null,
            'Decision Date': !!selectedFeature['Decision date']
              ? formatDate(selectedFeature['Decision date'])
              : null,
            'Legal Agreement Date': !!selectedFeature['Legal agreement date']
              ? formatDate(selectedFeature['Legal agreement date'])
              : null,
            'S106 Agreement Date': !!selectedFeature['S106 agreement date']
              ? formatDate(selectedFeature['S106 agreement date'])
              : null,
            'Registration Date': !!selectedFeature['Registered date']
              ? formatDate(selectedFeature['Registered date'])
              : null,
            'Lapsed Date': !!selectedFeature['Lapsed date']
              ? formatDate(selectedFeature['Lapsed date'])
              : null,
          }}
        />
      </ChartWrapper>
    </Grid>

    <Grid item xs={6}>
      <ChartWrapper title="CIL" info="Data source: Exacom">
        <ContentWrapper
          data={{ 'CIL Liable': selectedFeature['CIL liable'] }}
        />
      </ChartWrapper>
    </Grid>

    {/* for alignment in browser */}
    <Grid item xs={6} />
    <Grid item xs={6}>
      <ChartWrapper title="S106" info="Data source: Exacom">
        <ContentWrapper
          data={{
            'S106 Liable': selectedFeature['S106 liable'],
            'S106 Conditions Discharged on Site':
              selectedFeature['S106 discharged date'],
          }}
        />
      </ChartWrapper>
    </Grid>

    {/* for alignment in browser */}
    <Grid item xs={6} />
  </Grid>
);

export const ProjectInfoSkeleton = () => (
  <Grid
    container
    alignItems="flex-start"
    wrap="wrap"
    spacing={4}
    data-testid="project-details-skeleton"
  >
    <Grid item xs={6}>
      <ChartWrapperSkeleton>
        <Skeleton variant="rect" width={'100%'} height={'10rem'} />
      </ChartWrapperSkeleton>
    </Grid>
    <Grid item xs={6}>
      <ChartWrapperSkeleton>
        <Skeleton variant="rect" width={'100%'} height={'10rem'} />
      </ChartWrapperSkeleton>
    </Grid>
    <Grid item xs={6}>
      <ChartWrapperSkeleton>
        <Skeleton variant="rect" width={'100%'} height={'20rem'} />
      </ChartWrapperSkeleton>
    </Grid>
    <Grid item xs={6}>
      <ChartWrapperSkeleton>
        <Skeleton variant="rect" width={'100%'} height={'20rem'} />
      </ChartWrapperSkeleton>
    </Grid>
  </Grid>
);

export default ProjectInfo;
