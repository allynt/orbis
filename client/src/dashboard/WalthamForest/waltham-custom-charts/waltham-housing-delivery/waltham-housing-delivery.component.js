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
  userOrbState,
}) => {
  const styles = useStyles({});
  const [tenureType, setTenureType] = useState('All Tenure Types');

  const convertStringsToNumbers = obj =>
    Object.entries(obj).map(([k, v]) => ({ x: k, y: +v }));

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
            userTargetData={convertStringsToNumbers(
              userOrbState?.marketHousing,
            )}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Total Housing Delivery"
          info="This is a test description"
        >
          <TotalHousingMultiChart
            apiData={totalHousingDeliveryChartData}
            userTargetData={convertStringsToNumbers(userOrbState?.totalHousing)}
          />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
