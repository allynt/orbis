import React, { useMemo } from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryBar, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { GroupedWidthCalculator } from 'dashboard/utils';
import { groupedDataTransformer } from 'dashboard/WalthamForest/utils';

const TotalHousingMultiChart = ({ apiData, userTargetData }) => {
  const chartTheme = useChartTheme();

  const groupedData = useMemo(() => groupedDataTransformer(apiData), [apiData]);

  const renderTotalHousingMultiChart = width => {
    const { barWidth, offset } = GroupedWidthCalculator(apiData, width);

    const color = chartTheme.colors[5],
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
          {groupedData?.map((arr, i) => (
            <VictoryBar
              // eslint-disable-next-line react/no-array-index-key
              key={`dataset-${i}`}
              data={arr}
              style={{
                data: { fill: chartTheme.colors[i], width: barWidth },
              }}
            />
          ))}
        </VictoryGroup>

        {/* user uploaded target data */}
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
      </VictoryGroup>
    );
  };

  return (
    <BaseChart
      yLabel="Housing Delivery in Units"
      xLabel="Year"
      renderChart={renderTotalHousingMultiChart}
    />
  );
};

export { TotalHousingMultiChart };
