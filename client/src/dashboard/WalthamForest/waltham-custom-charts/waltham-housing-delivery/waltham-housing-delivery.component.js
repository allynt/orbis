import React, { useState } from 'react';

import {
  Grid,
  Select,
  MenuItem,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { stringToNumberTransformer } from 'dashboard/WalthamForest/utils';

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

  /**
   * @param {object[]} data
   */
  const getTenureType = data => {
    if (tenureType === 'All Tenure Types') {
      return data;
    } else {
      const result = data.map(datum => {
        console.log('tenureType: ', tenureType);
        console.log('datum: ', datum);
        return {
          Year: datum.Year,
          [tenureType]: datum[tenureType],
        };
      });
      console.log('result: ', result);
      return result;
    }
  };

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
            apiData={getTenureType(tenureHousingDeliveryChartData)}
            userTargetData={stringToNumberTransformer(
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
            userTargetData={stringToNumberTransformer(
              userOrbState?.totalHousing,
            )}
          />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
