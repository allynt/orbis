import React from 'react';

import { Grid, makeStyles } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

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
    padding: theme.spacing(2),
    '& > *': {
      width: '50%',
      textAlign: 'start',
    },
  },
  label: {
    fontWeight: 'bold',
  },
}));

/**@param {object} data */
const getTotals = data =>
  Object.values(data ?? {}).reduce((acc, value) => (acc += value), 0);

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
        return (
          <div key={key} className={styles.content}>
            <div className={styles.label}>{key}: </div>
            <div>{value ?? '-'}</div>
          </div>
        );
      })}
    </Grid>
  );
};

/**
 * @param {{ selectedFeature: object }} props
 */
const ProjectInfo = ({ selectedFeature }) => (
  <Grid container alignItems="flex-start" wrap="wrap" spacing={4}>
    <Grid item xs={6}>
      <ChartWrapper title="Reference Numbers" info="Test info">
        <ContentWrapper
          data={{
            'Planning Application Reference Number':
              selectedFeature['Application ID'],
            UPRN: selectedFeature.UPRN,
          }}
        />
      </ChartWrapper>
    </Grid>

    <Grid item xs={6}>
      <ChartWrapper title="Location" info="Test info">
        <ContentWrapper
          data={{
            Address: null,
            'Co-ordinates': selectedFeature['Site co-ordinates'],
          }}
        />
      </ChartWrapper>
    </Grid>

    <Grid item xs={6}>
      <ChartWrapper title="Site Details" info="Test info">
        <ContentWrapper
          data={{
            'Applicant Name': selectedFeature['Applicant name'],
            "Applicant's Company Name": null,
            Description: selectedFeature.Description,
            'Number of Units (Gross)':
              selectedFeature['Number of Units (Gross)'],
            'Number of Units (Net)': selectedFeature['Number of Units (Net)'],
            'Site Tenure Mix (Gross)': getTotals(
              selectedFeature['Site Tenure Mix (Gross)'],
            ),
            'Site Tenure Mix (Net)': getTotals(
              selectedFeature['Site Tenure Mix (Net)'],
            ),
            'No. Bedrooms': null,
          }}
        />
      </ChartWrapper>
    </Grid>

    <Grid item xs={6}>
      <ChartWrapper title="Dates" info="Test info">
        <ContentWrapper
          data={{
            'Received Date': selectedFeature['Received date'],
            'Committee Date': null,
            'Decision Date': selectedFeature['Decision date'],
            'Legal Agreement Date': null,
            'S106 Agreement Date': selectedFeature['S106 agreement date'],
            'Registration Date': selectedFeature['Registered date'],
            'Lapsed Date': selectedFeature['Lapsed date'],
          }}
        />
      </ChartWrapper>
    </Grid>

    <Grid item xs={6}>
      <ChartWrapper title="CIL" info="Test info">
        <ContentWrapper
          data={{
            // TODO: More than one possible property
            'CIL Liable': null,
          }}
        />
      </ChartWrapper>
    </Grid>

    {/* for alignment in browser */}
    <Grid item xs={6} />

    <Grid item xs={6}>
      <ChartWrapper title="S106" info="Test info">
        <ContentWrapper
          data={{
            // TODO: several possible properties
            'S106 Liable': null,
            'S106 Conditions Discharged on Site': null,
          }}
        />
      </ChartWrapper>
    </Grid>

    {/* for alignment in browser */}
    <Grid item xs={6} />
  </Grid>
);

export default ProjectInfo;
