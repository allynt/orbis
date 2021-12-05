import React from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryBar, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { GroupedWidthCalculator } from 'dashboard/utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';

const TotalHousingMultiChart = ({ apiData, userTargetData }) => {
  // const chartTheme = useChartTheme();

  if (!apiData) return null;

  const apiLegendData = [
      {
        name: 'Total Gross',
        symbol: { fill: '#37e5d8', type: 'square' },
      },
      {
        name: 'Total Net',
        symbol: { fill: '#8189f3', type: 'square' },
      },
    ],
    targetLegendData = [
      {
        name: 'Total Net',
        symbol: { fill: '#d13aff', type: 'minus' },
      },
    ];

  const renderTotalHousingLegend = width => {
    return (
      <WalthamCustomLegend
        apiLegendData={apiLegendData}
        targetLegendData={!!userTargetData ? targetLegendData : null}
        width={width}
      />
    );
  };

  const renderTotalHousingMultiChart = width => {
    const { barWidth, offset } = GroupedWidthCalculator(apiData, width);

    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: userTargetData,
        x: 'x',
        y: 'y',
      };
    return (
      <VictoryGroup>
        {/* data from API fetch */}
        <VictoryGroup offset={offset}>
          {apiData?.map((arr, i) => {
            const colors = ['#37e5d8', '#8189f3'];
            return (
              <VictoryBar
                // eslint-disable-next-line react/no-array-index-key
                key={`dataset-${i}`}
                data={arr}
                style={{
                  data: { fill: colors[i], width: barWidth },
                }}
              />
            );
          })}
        </VictoryGroup>

        {/* user uploaded target data */}
        {!!userTargetData ? (
          <VictoryGroup>
            <VictoryScatter
              {...props}
              style={{
                data: {
                  stroke: darken(color, 0.2),
                  width: scatterWidth,
                  fill: color,
                },
              }}
            />
            <VictoryLine {...props} style={{ data: { stroke: color } }} />
          </VictoryGroup>
        ) : null}
      </VictoryGroup>
    );
  };

  return (
    <BaseChart
      yLabel="Housing Delivery in Units"
      xLabel="Year"
      renderChart={renderTotalHousingMultiChart}
      renderLegend={renderTotalHousingLegend}
    />
  );
};

export { TotalHousingMultiChart };
