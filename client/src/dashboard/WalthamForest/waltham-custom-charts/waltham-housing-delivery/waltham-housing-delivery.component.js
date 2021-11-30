import React, { useState } from 'react';

import {
  Grid,
  Select,
  MenuItem,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

import { housingTenureTypes } from '../../waltham.constants';
import { TenureHousingMultiChart } from './tenure-housing-multi-chart/tenure-housing-multi-chart.component';
import { TotalHousingMultiChart } from './total-housing-multi-chart/total-housing-multi-chart.component';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#000',
    borderRadius: theme.shape.borderRadius,
    paddingBottom: '1rem',
    height: 'fit-content',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
  },
  select: {
    maxWidth: '20rem',
  },
  charts: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
}));

export const WalthamHousingDelivery = ({
  totalHousingDeliveryChartData,
  tenureHousingDeliveryChartData,
  approvalsGrantedChartData,
  userOrbState,
}) => {
  const styles = useStyles({});
  const [tenureType, setTenureType] = useState('All Tenure Types');

  let userTargetData = Object.entries(
    userOrbState?.totalHousing,
  ).map(([key, value]) => ({ x: key, y: value }));

  return (
    <Grid container direction="column" className={styles.container}>
      <Grid item className={styles.header}>
        <Typography variant="h1">Housing Delivery</Typography>
        <Select
          value={tenureType}
          onChange={({ target: { value } }) => setTenureType(value)}
          className={styles.select}
        >
          {housingTenureTypes.map(type => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item className={styles.charts}>
        <ChartWrapper
          title="Housing Delivery by Tenure Type"
          info="This is a test description"
        >
          <TenureHousingMultiChart
            apiData={tenureHousingDeliveryChartData}
            userTargetData={userTargetData}
          />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
