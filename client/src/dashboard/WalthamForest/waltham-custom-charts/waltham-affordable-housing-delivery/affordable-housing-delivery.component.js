import React, { useState } from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import {
  computePercentages,
  getLastNYearRange,
  getDataTimeline,
} from 'dashboard/WalthamForest/utils';
import { WalthamCustomDateRange } from 'dashboard/WalthamForest/waltham-custom-date-range/waltham-custom-date-range.component';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { yellowStyle } from 'dashboard/WalthamForest/waltham.constants';

import { labelsForArrayOfObjectsInclusive } from '../../tooltips-utils';

/**
 * @param {{
 *  affordableHousingDeliveryChartData: any
 *  targets: object
 *  settings: object
 *  setDashboardSettings: function
 * }} props
 */
const AffordableHousingDelivery = ({
  affordableHousingDeliveryChartData,
  targets,
  settings,
  setDashboardSettings,
}) => {
  const { walthamChartColors } = useChartTheme();

  const actualData = affordableHousingDeliveryChartData?.properties[0]?.data; // API data
  const chartTitle = `Affordable Housing Delivery ${getLastNYearRange(5)} (%)`;

  const [configuration, setConfiguration] = useState({
    totalYear: settings?.totalYear ?? undefined,
  });

  const { totalYear } = configuration;

  let percentageData = computePercentages(
    actualData,
    targets?.affordableHousingPercentage,
    'Affordable Housing',
  );

  const hasData = percentageData?.some(item => !!item['Affordable Housing']);

  let totalsArray = labelsForArrayOfObjectsInclusive(
    percentageData,
    ['Affordable Housing'],
    item => `${Math.round(item)}%`,
  );

  const apiLegendData = [
    {
      name: '% affordable housing delivered out of yearly target',
      color: walthamChartColors.affordableHousingDelivery[0],
    },
  ];

  const totalTimeline = getDataTimeline(
    actualData,
    targets?.affordableHousingPercentage,
    'year',
  );

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

  const renderLineChart = width => {
    if (!percentageData) return null;
    const y_max = Math.max(
      ...percentageData.map(item => item['Affordable Housing']),
    );
    const props = {
      data: percentageData,
      x: 'year',
      y: 'Affordable Housing',
      domain: { y: [0, y_max > 100 ? y_max : 100] },
    };
    return (
      <VictoryGroup>
        <VictoryLine {...props} style={yellowStyle} />
        <VictoryScatter
          labelComponent={FlyoutTooltip()}
          {...props}
          labels={totalsArray}
          style={yellowStyle}
        />
      </VictoryGroup>
    );
  };

  const renderAffordableHousingDeliveryLegend = width => {
    return (
      <WalthamCustomLegend
        apiLegendData={apiLegendData}
        targetLegendData={null}
        width={width}
      />
    );
  };

  return (
    <ChartWrapper
      title={chartTitle}
      info="This shows the % of affordable housing delivered each year"
    >
      <Grid item style={{ paddingBottom: '1rem' }}>
        <WalthamCustomDateRange
          timeline={totalTimeline}
          value={totalYear}
          onSelect={value => updateDateFilter({ totalYear: value })}
        />
      </Grid>
      {!hasData ? (
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          style={{ height: '12rem' }}
        >
          <Typography variant="h4">
            Please enter affordable housing delivery targets
          </Typography>
        </Grid>
      ) : (
        <BaseChart
          yLabel="Affordable Housing %"
          xLabel="Year"
          renderChart={renderLineChart}
          renderLegend={renderAffordableHousingDeliveryLegend}
        />
      )}
    </ChartWrapper>
  );
};
export { AffordableHousingDelivery };
