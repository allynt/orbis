import React, { useState } from 'react';

import {
  Grid,
  Select,
  MenuItem,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { CustomBaseChart } from '../../charts/custom-base-chart/custom-base-chart.component';
import { GroupedBarChart } from '../../charts/grouped-bar-chart/grouped-bar-chart.component';
import { StackedBarChart } from '../../charts/stacked-bar-chart/stacked-bar-chart.component';
import { housingTenureTypes } from '../waltham.constants';

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
}) => {
  const styles = useStyles({});
  const [tenureType, setTenureType] = useState('All Tenure Types');

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
          title="Total Housing Delivery"
          info="This is a test description"
        >
          <CustomBaseChart
            xLabel="Year"
            yLabel="Housing Delivery in Units"
            renderChart={width => (
              <GroupedBarChart
                data={totalHousingDeliveryChartData}
                width={width}
              />
            )}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Housing Delivery by Tenure Type"
          info="This is a test description"
        >
          <CustomBaseChart
            xLabel="Year"
            yLabel="Housing Delivery in Units"
            renderChart={width => (
              <StackedBarChart
                x="Year"
                ranges={[
                  'Affordable Rent',
                  'Intermediate',
                  'Market',
                  'Social Rented',
                  'Private Rented Sector',
                ]}
                data={tenureHousingDeliveryChartData}
                width={width}
              />
            )}
          />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
