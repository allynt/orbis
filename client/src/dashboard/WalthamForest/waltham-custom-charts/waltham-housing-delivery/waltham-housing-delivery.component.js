import React from 'react';

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
  updateWalthamOrbState,
}) => {
  const styles = useStyles({});
  const { tenureType, tenureDataType } = userOrbState;

  const selectedTenureType = tenureType ?? ALL_TENURE_TYPES;
  const selectedDataType = tenureDataType ?? TENURE_DATA_TYPES.net;

  /**
   * @param {string} value
   */
  const handleTenureTypeSelect = value =>
    updateWalthamOrbState({ tenureType: value });

  /**
   * @param {any} _
   * @param {string} type
   */
  const handleToggleClick = (_, type) =>
    updateWalthamOrbState({ tenureDataType: type });

  /**
   * @param {object[]} data
   */
  const getTenureType = data => {
    const type = housingTenureTypes[selectedTenureType];
    return selectedTenureType === ALL_TENURE_TYPES
      ? data
      : data?.map(datum => ({
          Year: datum.Year,
          [type]: datum[type],
        }));
  };

  return (
    <Grid container direction="column" className={styles.container}>
      <Grid item className={styles.header}>
        <Typography variant="h1">Housing Delivery</Typography>
        <Select
          value={selectedTenureType}
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
            value={selectedDataType}
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
            apiData={getTenureType(
              tenureHousingDeliveryChartData?.find(
                d => d.name === selectedDataType,
              )?.data,
            )}
            userTargetData={userOrbState}
            tenureType={
              selectedTenureType !== ALL_TENURE_TYPES
                ? selectedTenureType
                : undefined
            }
          />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
