import React, { useState, useMemo } from 'react';

import { Grid, Select, MenuItem } from '@astrosat/astrosat-ui';

import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import { labelsForArrayOfObjectsInclusive } from 'dashboard/WalthamForest/tooltips-utils';
import { filterByType } from 'dashboard/WalthamForest/utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import {
  progressionVsPlanningTypes,
  progressionVsPlanningOptions,
  progressionVsPlanningPalette,
  ALL_TYPES,
} from 'dashboard/WalthamForest/waltham.constants';

const ProgressionVsPlanningSchedule = ({ data }) => {
  const chartTheme = useChartTheme();

  // State. Current filter status, default to full chart
  const [selectedType, setSelectedType] = useState(ALL_TYPES);

  // The theme has a hard-coded value for stacked charts, but we want the
  // colours to be a different set. Therefore, I'm taking the theme and
  // overriding, the stacked colorScale setting here and passing it as as
  // a prop to the BaseChart.
  const updatedTheme = {
    ...chartTheme,
    stack: {
      colorScale: chartTheme.walthamChartColors.progressionVsPlanning,
    },
    pulldownmenu: {
      width: '10rem',
    },
  };

  const progressionVsPlanningChartData = useMemo(
    () => data?.properties[0].data,
    [data],
  );

  /**
   * @param {object[]} chartData : all chart data
   * @returns {object[]} : data filtered according to current filter
   */
  // const filterByType = chartData =>
  //   selectedType === ALL_TYPES
  //     ? chartData
  //     : chartData?.map(datum => ({
  //         Year: datum.Year,
  //         [selectedType]: datum[selectedType],
  //       }));

  const apiLegendData = progressionVsPlanningTypes.map((range, i) => ({
    name: range,
    color: chartTheme.walthamChartColors.progressionVsPlanning[i],
  }));

  const renderTenureHousingLegend = width => {
    return (
      <Grid
        container
        style={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Grid item>
          <WalthamCustomLegend apiLegendData={apiLegendData} width={width} />
        </Grid>
        <Grid item style={updatedTheme.pulldownmenu}>
          <Select
            value={selectedType}
            onChange={({ target: { value } }) => setSelectedType(value)}
          >
            <MenuItem value={ALL_TYPES}>{ALL_TYPES}</MenuItem>
            {Object.entries(progressionVsPlanningOptions).map(
              ([key, value]) => (
                <MenuItem key={key} value={value}>
                  {value}
                </MenuItem>
              ),
            )}
          </Select>
        </Grid>
      </Grid>
    );
  };

  const renderStackedBarChart = width => {
    const barWidth = width / 20;
    let ranges =
      selectedType === ALL_TYPES
        ? Object.values(progressionVsPlanningOptions)
        : [selectedType];
    const x = 'Year';
    const apiData = data?.properties[0]?.data;

    let totalsArray = labelsForArrayOfObjectsInclusive(
      apiData,
      ranges,
      ranges.length > 1 ? item => `Total: ${item}` : item => `${item}`,
    );

    return !!progressionVsPlanningChartData ? (
      <VictoryStack>
        {ranges?.map(range => (
          <VictoryBar
            labelComponent={FlyoutTooltip()}
            key={range}
            data={filterByType(
              progressionVsPlanningChartData,
              selectedType,
              ALL_TYPES,
              progressionVsPlanningOptions,
            )}
            x={x}
            y={range}
            labels={totalsArray}
            style={{
              data: {
                width: barWidth,
                fill: progressionVsPlanningPalette[range],
              },
            }}
          />
        ))}
      </VictoryStack>
    ) : null;
  };

  return (
    <ChartWrapper
      title="Progression of Units Relating to Planning Schedule"
      info="This is a test description"
    >
      <BaseChart
        yLabel="Number Of Units"
        xLabel="Financial Year"
        renderChart={renderStackedBarChart}
        renderLegend={renderTenureHousingLegend}
        theme={updatedTheme}
      />
    </ChartWrapper>
  );
};

export default ProgressionVsPlanningSchedule;
