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
import {
  getDataTimeline,
  getTargetTotals,
} from 'dashboard/WalthamForest/utils';

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
    padding: '1rem',
  },
  selects: {
    width: 'auto',
    '& > *': {
      maxWidth: '20rem',
    },
  },
  tenureTypeSelect: {
    marginRight: '1rem',
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
    tenureYear: '2018-2019',
  });

  const { tenureType, tenureDataType, tenureYear } = configuration;

  /**
   * @param {string} value
   */
  const handleTenureTypeSelect = value => {
    setConfiguration(prev => ({ ...prev, tenureType: value }));
    setDashboardSettings(prev => ({ ...prev, tenureType: value }));
  };

  /**
   * @param {string} value
   */
  const handleYearRangeSelect = value => {
    setConfiguration(prev => ({ ...prev, tenureYear: value }));
    setDashboardSettings(prev => ({ ...prev, tenureYear: value }));
  };

  /**
   * @param {any} _
   * @param {string} type
   */
  const handleToggleClick = (_, type) => {
    setConfiguration(prev => ({ ...prev, tenureDataType: type }));
    setDashboardSettings(prev => ({ ...prev, tenureDataType: type }));
  };

  /**
   * @param {object[]} data
   */
  const getTenureType = data => {
    const type = housingTenureTypes[tenureType];
    return tenureType === ALL_TENURE_TYPES
      ? data
      : data?.map(datum => ({
          Year: datum.Year,
          [type]: datum[type],
        }));
  };

  const targets =
    tenureType === ALL_TENURE_TYPES
      ? getTargetTotals(userOrbState)
      : userOrbState?.[tenureType];

  // TODO: maybe function no longer needed?
  const testData = getTenureType(
    tenureHousingDeliveryChartData?.find(d => d.name === tenureDataType)?.data,
  );

  const timeline = getDataTimeline(testData, targets);

  const disabledYears = timeline?.length >= 5 ? timeline.slice(0, 4) : [];

  const getSelectedTimeline = () => {
    // what's causing the need for ?s
    const index = timeline?.indexOf(tenureYear);
    return timeline?.slice(index - 4, index + 1);
  };

  return (
    <Grid container direction="column" className={styles.container}>
      <Grid
        item
        container
        justifyContent="space-between"
        alignItems="center"
        className={styles.header}
      >
        <Grid item component={Typography} variant="h1">
          Housing Delivery
        </Grid>
        <Grid item container wrap="nowrap" className={styles.selects}>
          <Select
            value={tenureType}
            onChange={({ target: { value } }) => handleTenureTypeSelect(value)}
            className={styles.tenureTypeSelect}
          >
            <MenuItem value={ALL_TENURE_TYPES}>{ALL_TENURE_TYPES}</MenuItem>
            {Object.entries(housingTenureTypes).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={tenureYear}
            onChange={({ target: { value } }) => handleYearRangeSelect(value)}
            className={styles.select}
          >
            {timeline?.map(year => (
              <MenuItem
                key={year}
                value={year}
                disabled={disabledYears.includes(year)}
              >
                {year}
              </MenuItem>
            ))}
          </Select>
        </Grid>
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
            apiData={testData}
            userTargetData={targets}
            tenureType={
              tenureType !== ALL_TENURE_TYPES ? tenureType : undefined
            }
            filteredTimeline={getSelectedTimeline()}
          />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
