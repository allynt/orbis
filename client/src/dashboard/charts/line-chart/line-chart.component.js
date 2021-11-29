import React from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { VictoryLine, VictoryScatter, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';

/**
 * @param {{
 *  x: string
 *  range: string[]
 *  data: any[]
 *  width?: any
 * }} props
 */
const LineChart = ({ x = 'x', range = ['y'], data, width }) => {
  const chartTheme = useChartTheme();

  const color = chartTheme.colors[0],
    scatterWidth = width / 2,
    props = {
      data,
      x,
      y: range,
    };

  return (
    <VictoryGroup>
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

export { LineChart };
