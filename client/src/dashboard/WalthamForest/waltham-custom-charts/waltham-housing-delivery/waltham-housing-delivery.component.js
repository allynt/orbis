import React, { useState, useEffect } from 'react';

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
  selectFilters: {
    width: 'fit-content',
  },
  select: {
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    maxWidth: '15rem',
    '&:focus': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      marginRight: '1rem',
    },
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

// TODO: why does NaN flicker when out-of-range date is selected?

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
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      wrap="nowrap"
      className={styles.selectFilters}
    >
      <Grid
        item
        component={Select}
        value={tenureYear ?? ''}
        onChange={({ target: { value } }) => handleYearRangeSelect(value)}
        classes={{ root: styles.select }}
        className={styles.select}
        disableUnderline
      >
        {timeline?.map(year => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Grid>

      <Grid
        item
        component={Select}
        value={tenureType}
        onChange={({ target: { value } }) => handleTenureTypeSelect(value)}
        classes={{ root: styles.select }}
        disableUnderline
      >
        <MenuItem value={ALL_TENURE_TYPES}>{ALL_TENURE_TYPES}</MenuItem>
        {Object.entries(housingTenureTypes).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
      </Grid>
    </Grid>
  );
};

const getFilteredTimeline = (timeline, tenureYear) => {
  // TODO: what's causing the need for ?s
  const index = timeline?.indexOf(tenureYear);
  const startIndex = index < 5 ? 0 : index - 4;
  return timeline?.slice(startIndex, index + 1);
};

// TODO: types correct?

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
    tenureDataType: settings?.tenureDataType ?? TENURE_DATA_TYPES.net,
    tenureYear: settings?.tenureYear ?? undefined,
  });

  const { tenureType, tenureDataType, tenureYear } = configuration;

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

  /**
   * @param {string} value
   */
  const handleYearRangeSelect = value => {
    setConfiguration(prev => ({
      ...prev,
      tenureYear: value,
    }));
    setDashboardSettings(prev => ({
      ...prev,
      settings: { ...prev.settings, tenureYear: value },
    }));
  };

  /**
   * @param {any} _
   * @param {string} type
   */
  const handleToggleClick = (_, type) => {
    setConfiguration(prev => ({ ...prev, tenureDataType: type }));
    setDashboardSettings(prev => ({
      ...prev,
      settings: { ...prev.settings, tenureDataType: type },
    }));
  };

  const processedTargets =
    tenureType === ALL_TENURE_TYPES
      ? getTargetTotals(targets)
      : targets?.[tenureType];

  // TODO: refactor this
  const dataByTenureType = filterByType(
    tenureHousingDeliveryChartData?.find(d => d.name === tenureDataType)?.data,
    tenureType,
    ALL_TENURE_TYPES,
    housingTenureTypes,
  );

  const timeline = getDataTimeline(dataByTenureType, processedTargets);

  useEffect(() => {
    // abort if timeline has not been built or selected year is valid
    if (!timeline || timeline.includes(tenureYear)) return;

    // otherwise reset date range selector
    const defaultYear = timeline[timeline.length - 1];

    setConfiguration(prev => ({
      ...prev,
      tenureYear: defaultYear,
    }));

    setDashboardSettings(prev => ({
      ...prev,
      settings: { ...prev.settings, tenureYear: defaultYear },
    }));
  }, [tenureYear, timeline, settings]);

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
          <TotalHousingMultiChart
            apiData={totalHousingDeliveryChartData}
            userTargetData={targets?.totalHousing}
          />
        </ChartWrapper>

        <ChartWrapper
          title="Housing Delivery by Tenure Type"
          info="This is a test description"
          headerComponent={
            <TenureDataFilter
              timeline={timeline}
              tenureYear={tenureYear}
              tenureType={tenureType}
              housingTenureTypes={housingTenureTypes}
              handleYearRangeSelect={handleYearRangeSelect}
              handleTenureTypeSelect={handleTenureTypeSelect}
            />
          }
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
            apiData={dataByTenureType}
            userTargetData={processedTargets}
            tenureType={
              tenureType !== ALL_TENURE_TYPES ? tenureType : undefined
            }
            filteredTimeline={getFilteredTimeline(timeline, tenureYear)}
          />
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};
