import React, { useState } from 'react';

import {
  Grid,
  Select,
  MenuItem,
  Typography,
  makeStyles,
  ToggleButtonGroup,
  ToggleButton,
} from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { filterByType } from 'dashboard/WalthamForest/utils';

import { housingTenureTypes, TENURE_DATA_TYPES } from '../../waltham.constants';
import { TenureHousingMultiChart } from './tenure-housing-multi-chart/tenure-housing-multi-chart.component';
import { TotalHousingMultiChart } from './total-housing-multi-chart/total-housing-multi-chart.component';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#1b2227',
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
    alignItems: 'stretch',
    gap: '1rem',
  },
  buttons: {
    width: '40%',
    marginLeft: '60%',
    marginBottom: '-1rem',
  },
}));

const ALL_TENURE_TYPES = 'All Tenure Types';

export const WalthamHousingDelivery = ({
  totalHousingDeliveryChartData,
  tenureHousingDeliveryChartData,
  userOrbState,
  setDashboardSettings,
}) => {
  const styles = useStyles({});

  const [configuration, setConfiguration] = useState({
    tenureType: userOrbState.tenureType ?? ALL_TENURE_TYPES,
    tenureDataType: userOrbState.tenureDataType ?? TENURE_DATA_TYPES.net,
  });

  const { tenureType, tenureDataType } = configuration;

  /**
   * @param {string} value
   */
  const handleTenureTypeSelect = value => {
    setConfiguration(prev => ({ ...prev, tenureType: value }));
    setDashboardSettings(prev => ({ ...prev, tenureType: value }));
  };

  /**
   * @param {any} _
   * @param {string} type
   */
  const handleToggleClick = (_, type) => {
    setConfiguration(prev => ({ ...prev, tenureDataType: type }));
    setDashboardSettings(prev => ({ ...prev, tenureDataType: type }));
  };

  return (
    <Grid container direction="column" className={styles.container}>
      <Grid item className={styles.header}>
        <Typography variant="h1">Housing Delivery</Typography>
        <Select
          value={tenureType}
          onChange={({ target: { value } }) => handleTenureTypeSelect(value)}
          className={styles.select}
        >
          <MenuItem value={ALL_TENURE_TYPES}>{ALL_TENURE_TYPES}</MenuItem>
          {Object.entries(housingTenureTypes).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item className={styles.charts}>
        <ChartWrapper
          title="Total Housing Delivery"
          info="This is a test description"
        >
          <TotalHousingMultiChart
            apiData={totalHousingDeliveryChartData}
            userTargetData={userOrbState?.totalHousing}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Housing Delivery by Tenure Type"
          info="This is a test description"
        >
          <ToggleButtonGroup
            size="small"
            value={tenureDataType}
            orientation="horizontal"
            onChange={handleToggleClick}
            className={styles.buttons}
          >
            <ToggleButton value={TENURE_DATA_TYPES.gross}>
              {TENURE_DATA_TYPES.gross}
            </ToggleButton>
            <ToggleButton value={TENURE_DATA_TYPES.net}>
              {TENURE_DATA_TYPES.net}
            </ToggleButton>
          </ToggleButtonGroup>

          <TenureHousingMultiChart
            apiData={filterByType(
              tenureHousingDeliveryChartData?.find(
                d => d.name === tenureDataType,
              )?.data,
              tenureType,
              ALL_TENURE_TYPES,
              housingTenureTypes,
            )}
            userTargetData={userOrbState}
            tenureType={
              tenureType !== ALL_TENURE_TYPES ? tenureType : undefined
            }
          />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
