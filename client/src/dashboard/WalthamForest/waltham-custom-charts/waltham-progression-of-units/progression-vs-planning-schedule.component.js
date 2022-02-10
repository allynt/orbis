import React, { useMemo } from 'react';

import { VictoryBar, VictoryStack, VictoryTooltip } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { progressionVsPlanningTypes } from 'dashboard/WalthamForest/waltham.constants';

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

    return !!progressionVsPlanningChartData ? (
      <VictoryStack>
        {ranges?.map(range => (
          <VictoryBar
            labelComponent={
              <VictoryTooltip
                dy={0}
                centerOffset={{ x: 25 }}
                pointerWidth={0}
                flyoutStyle={{
                  stroke: 'none',
                  fill: '#f6be00',
                }}
                flyoutHeight={40}
                flyoutWidth={120}
              />
            }
            key={range}
            data={progressionVsPlanningChartData}
            x={x}
            y={range}
            labels={({ data, datum }) => {
              const fieldList = Object.keys(data[0]);
              const fieldsToAdd = fieldList.filter(
                item =>
                  item !== 'Year' &&
                  item !== '_group' &&
                  item !== '_x' &&
                  item !== '_y' &&
                  item !== '_stack' &&
                  item !== '_x1' &&
                  item !== '_y0' &&
                  item !== '_y1',
              );
              let totalsArray = [];
              for (let index in data) {
                let total = 0;
                for (let fieldName of fieldsToAdd) {
                  total += data[index][fieldName];
                }
                totalsArray.push(total);
              }

              if (datum._x === 2014) {
                return ` Total: ${totalsArray[0]}`;
              } else if (datum._x === 2015) {
                return ` Total: ${totalsArray[1]}`;
              } else if (datum._x === 2016) {
                return ` Total: ${totalsArray[2]}`;
              } else if (datum._x === 2017) {
                return ` Total: ${totalsArray[3]}`;
              } else if (datum._x === 2018) {
                return ` Total: ${totalsArray[4]}`;
              } else if (datum._x === 2019) {
                return ` Total: ${totalsArray[5]}`;
              } else if (datum._x === 2020) {
                return ` Total: ${totalsArray[6]}`;
              } else if (datum._x === 2021) {
                return ` Total: ${totalsArray[7]}`;
              }

              return ` ${totalsArray}`;
            }}
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
