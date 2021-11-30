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
 *  data: any[]
 * }} props
 */
const HousingTenureMultiChart = ({ data }) => {
  const chartTheme = useChartTheme();

  if (!data) return null;

  const renderHousingTenureMultiChart = width => {
    const barWidth = width / 20;

    // BREAKS WITH MISSING RANGE VALUES
    const ranges = ['Intermediate', 'Market'];

    const color = chartTheme.colors[5],
      scatterWidth = width / 2,
      props = {
        data,
        x: 'Year',
        y: 'Target',
      };

    console.log('data: ', data);

    return (
      <VictoryGroup>
        <VictoryStack>
          {ranges?.map(range => (
            <VictoryBar
              key={range}
              data={data}
              x="Year"
              y={range}
              style={{
                data: { width: barWidth },
              }}
            />
          ))}
        </VictoryStack>

        <VictoryLine {...props} style={{ data: { stroke: color } }} />

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
      </VictoryGroup>
    );
  };

  return (
    <BaseChart
      yLabel="Test Y Label"
      xLabel="Test X Label"
      renderChart={renderHousingTenureMultiChart}
    />
  );
};

export { HousingTenureMultiChart };
