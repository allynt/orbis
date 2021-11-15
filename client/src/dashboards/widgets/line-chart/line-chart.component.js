import React from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { VictoryLine, VictoryScatter, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';
import { Chart } from '../chart/chart.component';

/**
 * @param {{
 *  x: string
 *  ranges: string[]
 *  xLabel?: string
 *  yLabel?: string
 *  data: any[]
 * }} props
 */
const LineChart = ({
  x = 'x',
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
  data,
}) => {
  const chartTheme = useChartTheme();

  const renderRange = (range, i) => {
    const color = chartTheme.colors[i % chartTheme.colors.length];
    const props = {
      data,
      x,
      y: range,
    };
    return (
      <VictoryGroup key={range}>
        <VictoryLine {...props} style={{ data: { stroke: color } }} />
        <VictoryScatter
          {...props}
          style={{
            data: {
              stroke: darken(color, 0.2),
              fill: color,
            },
          }}
        />
      </VictoryGroup>
    );
  };

  return (
    <Chart
      x={x}
      ranges={ranges}
      xLabel={xLabel}
      yLabel={yLabel}
      data={data}
      renderRange={renderRange}
    />
  );
};

export { LineChart };
