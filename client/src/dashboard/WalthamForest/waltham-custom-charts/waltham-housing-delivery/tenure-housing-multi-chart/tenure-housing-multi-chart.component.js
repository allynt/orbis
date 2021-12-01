import React from 'react';

import { darken } from '@astrosat/astrosat-ui';

import {
  VictoryBar,
  VictoryStack,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
} from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

/**
 * @param {{
 *  apiData: any[]
 *  userTargetData: any[]
 * }} props
 */
const TenureHousingMultiChart = ({ apiData, userTargetData }) => {
  const chartTheme = useChartTheme();

  if (!apiData) return null;

  const renderTenureHousingMultiChart = width => {
    const barWidth = width / 20;

    // BREAKS WITH MISSING RANGE VALUES
    const ranges = [
      'Affordable Rent',
      'Intermediate',
      'Market',
      'Social Rented',
      'Private Rented Sector',
    ];

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
        <VictoryGroup>
          <VictoryStack>
            {ranges?.map(range => (
              <VictoryBar
                key={range}
                data={apiData}
                x="Year"
                y={range}
                style={{
                  data: { width: barWidth },
                }}
              />
            ))}
          </VictoryStack>
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
      renderChart={renderTenureHousingMultiChart}
    />
  );
};

export { TenureHousingMultiChart };
