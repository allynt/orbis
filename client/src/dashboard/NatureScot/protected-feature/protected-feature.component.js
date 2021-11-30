import React from 'react';

import { makeStyles, Typography } from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { GaugeChart } from 'dashboard/charts/gauge/gauge.component';

import ProtectedFeatureButtonGroup from './protected-feature-button-group.component';
import ProtectedFeatureList from './protected-feature-list.component';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
  },
  gauge: {},
  features: {
    display: 'flex',
    flexDirection: 'column',
    // width: '30%',
  },
  chart: {
    // width: '500px',
    paddingRight: '1rem',
  },
  heading: {
    backgroundColor: '#34414a',
    color: '#fff',
    fontWeight: 600,
    padding: '2rem 0 0 1rem',
  },
}));

const ProtectedFeature = ({ buttons, features, onSubmit }) => {
  const styles = useStyles();

  return (
    <ChartWrapper
      title="Protected Features"
      info="The description for this panel"
    >
      <div className={styles.wrapper}>
        {/* <div className={styles.chart}>
          <Typography variant="h3" className={styles.heading}>
            General EcoHealth of Selected Area
          </Typography>
          <GaugeChart />
        </div> */}

        <div className={styles.features}>
          <ProtectedFeatureButtonGroup buttons={buttons} onSubmit={onSubmit} />
          <ProtectedFeatureList features={features} />
        </div>
      </div>
    </ChartWrapper>
  );
};

export default ProtectedFeature;
