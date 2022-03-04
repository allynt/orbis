import React, { useState, useEffect, useMemo } from 'react';

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
  filterByType,
  getFilteredTimeline,
} from 'dashboard/WalthamForest/utils';
import {
  WalthamCustomDateRange,
  useWalthamSelectStyles,
} from 'dashboard/WalthamForest/waltham-custom-date-range/waltham-custom-date-range.component';

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
  selectFilters: {
    width: 'fit-content',
    margin: '0 0 1rem auto',
    gap: '1rem',
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

// TODO: toggle buttons are disabled and initialisation of Gross/Net in state is hardcoded to 'Gross' for now, because mock data contained Gross/Net data, but API does not. This may be re-instated in the future, so commenting out is better than removing only to code again later.

/**
 * @param {{
 *  timeline: string[]
 *  tenureYear: string
 *  tenureType: string
 *  housingTenureTypes: object
 *  handleYearRangeSelect: (value: string) => void
 *  handleTenureTypeSelect: (value: string) => void
 * }} props
 */
const TenureDataFilter = ({
  timeline,
  tenureYear,
  tenureType,
  housingTenureTypes,
  handleYearRangeSelect,
  handleTenureTypeSelect,
}) => {
  const styles = useStyles();
  const { root, select } = useWalthamSelectStyles({});
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      wrap="nowrap"
      className={styles.selectFilters}
    >
      <Grid item>
        <Select
          value={tenureType}
          onChange={({ target: { value } }) => handleTenureTypeSelect(value)}
          classes={{ root, select }}
          disableUnderline
        >
          <MenuItem value={ALL_TENURE_TYPES}>{ALL_TENURE_TYPES}</MenuItem>
          {Object.entries(housingTenureTypes).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item>
        <WalthamCustomDateRange
          timeline={timeline}
          value={tenureYear}
          onSelect={handleYearRangeSelect}
        />
      </Grid>
    </Grid>
  );
};

/**
 * @param {{
 *  totalHousingDeliveryChartData: object[]
 *  tenureHousingDeliveryChartData: object[]
 *  targets: object,
 *  settings: object
 *  setDashboardSettings: function
 * }} params
 */
export const WalthamHousingDelivery = ({
  totalHousingDeliveryChartData,
  tenureHousingDeliveryChartData,
  targets,
  settings,
  setDashboardSettings,
}) => {
  const styles = useStyles({});

  const [configuration, setConfiguration] = useState({
    tenureType: settings?.tenureType ?? ALL_TENURE_TYPES,
    tenureDataType: TENURE_DATA_TYPES.gross,
    tenureYear: settings?.tenureYear ?? undefined,
    totalYear: settings?.totalYear ?? undefined,
  });

  const { tenureType, tenureDataType, tenureYear, totalYear } = configuration;

  /**
   * @param {object} newSettings
   */
  const updateDateFilter = newSettings => {
    setConfiguration(prev => ({
      ...prev,
      ...newSettings,
    }));

    setDashboardSettings(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  /**
   * @param {string} value
   */
  const handleTenureTypeSelect = value => {
    setConfiguration(prev => ({ ...prev, tenureType: value }));
    setDashboardSettings(prev => ({
      ...prev,
      settings: { ...prev.settings, tenureType: value },
    }));
  };

  // /**
  //  * @param {any} _
  //  * @param {string} type
  //  */
  // const handleToggleClick = (_, type) => {
  //   setConfiguration(prev => ({ ...prev, tenureDataType: type }));
  //   setDashboardSettings(prev => ({
  //     ...prev,
  //     settings: { ...prev.settings, tenureDataType: type },
  //   }));
  // };

  const processedTargets =
    tenureType === ALL_TENURE_TYPES
      ? getTargetTotals(targets)
      : targets?.[tenureType];

  const dataByTenureType = useMemo(
    () =>
      filterByType(
        tenureHousingDeliveryChartData?.find(d => d.name === tenureDataType)
          ?.data,
        tenureType,
        ALL_TENURE_TYPES,
        housingTenureTypes,
      ),
    [tenureDataType, tenureHousingDeliveryChartData, tenureType],
  );

  const totalTimeline = getDataTimeline(
      totalHousingDeliveryChartData,
      targets?.totalHousing,
    ),
    tenureTimeline = getDataTimeline(dataByTenureType, processedTargets);

  // setup/error catch for total chart
  useEffect(() => {
    if (!totalTimeline || totalTimeline.includes(totalYear)) {
      return;
    } else {
      updateDateFilter({ totalYear: totalTimeline[totalTimeline.length - 1] });
    }
  }, [totalYear, totalTimeline]);

  // setup/error catch for tenure chart
  useEffect(() => {
    if (!tenureTimeline || tenureTimeline.includes(tenureYear)) {
      return;
    } else {
      updateDateFilter({
        tenureYear: tenureTimeline[tenureTimeline.length - 1],
      });
    }
  }, [tenureYear, tenureTimeline]);

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
      </Grid>

      <Grid item className={styles.charts}>
        <ChartWrapper
          title="Total Housing Delivery"
          info="This is a test description"
        >
          <WalthamCustomDateRange
            timeline={totalTimeline}
            value={totalYear}
            onSelect={value => updateDateFilter({ totalYear: value })}
          />
          <TotalHousingMultiChart
            apiData={totalHousingDeliveryChartData}
            userTargetData={targets?.totalHousing}
            filteredTimeline={getFilteredTimeline(totalTimeline, totalYear)}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Housing Delivery by Tenure Type"
          info="This is a test description"
        >
          <TenureDataFilter
            timeline={tenureTimeline}
            tenureYear={tenureYear}
            tenureType={tenureType}
            housingTenureTypes={housingTenureTypes}
            handleYearRangeSelect={value =>
              updateDateFilter({ tenureYear: value })
            }
            handleTenureTypeSelect={handleTenureTypeSelect}
          />
          {/* <ToggleButtonGroup
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
          </ToggleButtonGroup> */}

          {tenureTimeline?.includes(tenureYear) ? (
            <TenureHousingMultiChart
              apiData={dataByTenureType}
              userTargetData={processedTargets}
              tenureType={
                tenureType !== ALL_TENURE_TYPES ? tenureType : undefined
              }
              filteredTimeline={getFilteredTimeline(tenureTimeline, tenureYear)}
            />
          ) : null}
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
