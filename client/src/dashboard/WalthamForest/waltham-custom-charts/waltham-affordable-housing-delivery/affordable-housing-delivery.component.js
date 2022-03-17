import React, { useState, useEffect } from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { StyledParentSize } from 'dashboard/charts/styled-parent-size.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import {
  getDataTimeline,
  computePercentages,
} from 'dashboard/WalthamForest/utils';
import { WalthamCustomDateRange } from 'dashboard/WalthamForest/waltham-custom-date-range/waltham-custom-date-range.component';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { yellowStyle } from 'dashboard/WalthamForest/waltham.constants';

import { labelsForArrayOfObjectsInclusive } from '../../tooltips-utils';

/**
 * @param {object[]} data
 * @param {number} year
 * @returns {object[]}
 */
const getFilteredData = (data, year) => {
  if (!data) return;
  const currentYearObject = data.find(datum => +datum.startYear === year);
  const index = data.indexOf(currentYearObject);
  return data.slice(index - 4, index + 1);
};

/**
 * @param {{
 *  data: object[]
 *  targets: object
 *  settings: object
 *  setDashboardSettings: function
 * }} props
 */
const AffordableHousingDelivery = ({
  data,
  targets,
  settings,
  setDashboardSettings,
}) => {
  const { walthamChartColors } = useChartTheme();

  const [configuration, setConfiguration] = useState({
    affordableHousingTotalYear:
      settings?.affordableHousingTotalYear ?? undefined,
  });

  const { affordableHousingTotalYear } = configuration;

  const apiLegendData = [
    {
      name: '% affordable housing delivered out of yearly target',
      color: walthamChartColors.affordableHousingDelivery[0],
    },
  ];

  const timeline = getDataTimeline(data, targets);

  const percentageData = computePercentages(
    timeline,
    data,
    targets,
    'Affordable Housing',
  );

  const hasData = percentageData?.some(item => !!item['Affordable Housing']);

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

  // setup/error catch for affordable housing chart
  useEffect(() => {
    if (!timeline || timeline.includes(affordableHousingTotalYear)) {
      return;
    } else {
      updateDateFilter({
        affordableHousingTotalYear: timeline[timeline.length - 1],
      });
    }
  }, [affordableHousingTotalYear, timeline]);

  const AffordableHousingLineChart = ({ width }) => {
    if (!data) return null;
    const filteredData = getFilteredData(
      percentageData,
      affordableHousingTotalYear,
    );

    if (!filteredData) return null;

    const totalsArray = labelsForArrayOfObjectsInclusive(
      filteredData,
      ['Affordable Housing'],
      item => `${item}%`,
    );

    const y_max = Math.max(
      ...filteredData.map(item => item['Affordable Housing']),
    );

    const props = {
      data: filteredData,
      x: 'startYear',
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

  return (
    <ChartWrapper
      title="Affordable Housing Delivery (%)"
      info="The percentage of affordable housing delivered each year. The values shown are for the total affordable housing sites delivered as the sum of: 'Affordable Rent (not at LAR benchmark rents)' and 'London Affordable Rent' for the London Borough Waltham Forest area"
    >
      <StyledParentSize>
        {({ width }) =>
          !hasData ? (
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
            <>
              <WalthamCustomDateRange
                timeline={timeline}
                value={affordableHousingTotalYear}
                onSelect={value =>
                  updateDateFilter({ affordableHousingTotalYear: value })
                }
              />
              <WalthamCustomLegend
                width={width}
                apiLegendData={apiLegendData}
                targetLegendData={null}
                padTop
              />
              <BaseChart
                yLabel="Affordable Housing %"
                xLabel="Financial Year"
                width={width}
              >
                {AffordableHousingLineChart({ width })}
              </BaseChart>
            </>
          )
        }
      </StyledParentSize>
    </ChartWrapper>
  );
};
export { AffordableHousingDelivery };
