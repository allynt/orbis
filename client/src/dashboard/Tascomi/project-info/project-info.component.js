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
export const getTotals = (data = {}) => {
  const values = Object.values(data);
  return values.every(v => !v)
    ? null
    : values.reduce((acc, value) => (!value ? acc : (acc += +value)), 0);
};

const ContentWrapper = ({ data }) => {
  const styles = useStyles({});
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      className={styles.contentWrapper}
    >
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className={styles.content}>
          <div className={styles.label}>{key}: </div>
          <div>{value ?? '-'}</div>
        </div>
      ))}
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
      <ChartWrapper
        title="Dates"
        info="Data sources: Tascomi, and Exacom ('S106 agreement date', 'S106 discharged date')"
      >
        <ContentWrapper
          data={{
            'Received Date': selectedFeature['Received date'],
            'Committee Date': selectedFeature['Committee date'],
            'Decision Date': selectedFeature['Decision date'],
            'Legal Agreement Date': selectedFeature['Legal agreement date'],
            'S106 Agreement Date': selectedFeature['S106 agreement date'],
            'Registration Date': selectedFeature['Registered date'],
            'Lapsed Date': selectedFeature['Lapsed date'],
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
