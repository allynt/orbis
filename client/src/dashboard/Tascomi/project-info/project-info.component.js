import React from 'react';

import { Grid, Skeleton, makeStyles, Typography } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from 'dashboard/charts/chart-wrapper.component';
import { formatDate } from 'utils/dates';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
  },
  content: {
    minHeight: '4ch',
    '& > *': {
      width: '50%',
      textAlign: 'start',
    },
  },
  nestedContent: {
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
const ContentWrapper = ({ data }) => {
  const styles = useStyles({});
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      className={styles.contentWrapper}
    >
      {Object.entries(data).map(([key, value]) => {
        const isNested = !!value && typeof value === 'object';
        return (
          <Grid
            item
            container
            alignItems="center"
            wrap="nowrap"
            key={key}
            className={clsx(
              styles.content,
              isNested ? styles.nestedContent : null,
            )}
          >
            <Grid item component={Typography} className={styles.label}>
              {key}:{' '}
            </Grid>
            <Grid item component={Typography}>
              {value ?? '-'}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

/**
 * @param {{ selectedFeature: object }} props
 */
const ProjectInfo = ({ selectedFeature }) => {
  const styles = useStyles();
  return (
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
        <ChartWrapper
          title="Location"
          info="Data source: LBWF Tascomi Planning"
        >
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
              ]
                ? Object.entries(
                    selectedFeature['Site Tenure Mix (Gross)'],
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className={clsx(styles.content, styles.nestedContent)}
                    >
                      <span>{key}: </span>
                      <span>{value ?? '-'}</span>
                    </div>
                  ))
                : null,
              'Site Tenure Mix (Net)': !!selectedFeature[
                'Site Tenure Mix (Net)'
              ]
                ? Object.entries(selectedFeature['Site Tenure Mix (Net)']).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className={clsx(styles.content, styles.nestedContent)}
                      >
                        <span>{key}: </span>
                        <span>{value ?? '-'}</span>
                      </div>
                    ),
                  )
                : null,
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
                ? formatDate(new Date(selectedFeature['Received date']))
                : null,
              'Committee Date': !!selectedFeature['Committee date']
                ? formatDate(new Date(selectedFeature['Committee date']))
                : null,
              'Decision Date': !!selectedFeature['Decision date']
                ? formatDate(new Date(selectedFeature['Decision date']))
                : null,
              'Legal Agreement Date': !!selectedFeature['Legal agreement date']
                ? formatDate(new Date(selectedFeature['Legal agreement date']))
                : null,
              'S106 Agreement Date': !!selectedFeature['S106 agreement date']
                ? formatDate(new Date(selectedFeature['S106 agreement date']))
                : null,
              'Registration Date': !!selectedFeature['Registered date']
                ? formatDate(new Date(selectedFeature['Registered date']))
                : null,
              'Lapsed Date': !!selectedFeature['Lapsed date']
                ? formatDate(new Date(selectedFeature['Lapsed date']))
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
};

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
