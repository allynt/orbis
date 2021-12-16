import React from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryBar, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { GroupedWidthCalculator } from 'dashboard/utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import {
  TENURE_DATA_TYPES,
  TARGET_LEGEND_DATA,
} from 'dashboard/WalthamForest/waltham.constants';

const TotalHousingMultiChart = ({ apiData, userTargetData }) => {
  const { walthamChartColors } = useChartTheme();

  if (!apiData) return null;

  const apiLegendData = Object.values(TENURE_DATA_TYPES).map((type, i) => ({
    name: type,
    color: walthamChartColors.totalHousing[i],
  }));

  const renderTotalHousingLegend = width => (
    <WalthamCustomLegend
      apiLegendData={apiLegendData}
      targetLegendData={!!userTargetData ? TARGET_LEGEND_DATA : null}
      width={width}
    />
  );

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
          {apiData?.map((arr, i) => (
            <VictoryBar
              // eslint-disable-next-line react/no-array-index-key
              key={`dataset-${i}`}
              data={arr}
              style={{
                data: {
                  fill: walthamChartColors.totalHousing[i],
                  width: barWidth,
                },
              }}
            />
          ))}
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
