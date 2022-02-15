import React, { useMemo } from 'react';

import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { labelsForArrayOfObjectsInclusive } from 'dashboard/WalthamForest/tooltips-utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { progressionVsPlanningTypes } from 'dashboard/WalthamForest/waltham.constants';
import WalthamTooltip from 'dashboard/WalthamForest/walthamTooltip/walthamTooltip.component';

const ProgressionVsPlanningSchedule = ({ data }) => {
  const chartTheme = useChartTheme();
  // The theme has a hard-coded value for stacked charts, but we want the
  // colours to be a different set. Therefore, I'm taking the theme and
  // overriding, the stacked colorScale setting here and passing it as as
  // a prop to the BaseChart.
  const updatedTheme = {
    ...chartTheme,
    stack: {
      colorScale: chartTheme.walthamChartColors.progressionVsPlanning,
    },
  };

  const progressionVsPlanningChartData = useMemo(
    () => data?.properties[0].data,
    [data],
  );

  const apiLegendData = progressionVsPlanningTypes.map((range, i) => ({
    name: range,
    color: chartTheme.walthamChartColors.progressionVsPlanning[i],
  }));

  const renderTenureHousingLegend = width => {
    return <WalthamCustomLegend apiLegendData={apiLegendData} width={width} />;
  };

  const renderStackedBarChart = width => {
    const barWidth = width / 20;
    const ranges = ['Ahead of Schedule', 'Behind Schedule', 'On Track'];
    const x = 'Year';

    const apiData = data?.properties[0]?.data;
    let totalsArray = labelsForArrayOfObjectsInclusive(
      apiData,
      ['Ahead of Schedule', 'Behind Schedule', 'On Track'],
      item => `${item}`,
    );
    return !!progressionVsPlanningChartData ? (
      <VictoryStack>
        {ranges?.map(range => (
          <VictoryBar
            labelComponent={WalthamTooltip()}
            key={range}
            data={progressionVsPlanningChartData}
            x={x}
            y={range}
            labels={totalsArray}
            style={{
              data: {
                width: barWidth,
              },
              labels: { fill: 'black' },
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
