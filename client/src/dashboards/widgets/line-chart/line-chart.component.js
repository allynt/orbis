import React from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryGroup,
} from 'victory';

import { useChartTheme } from '../../useChartTheme';

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
  return (
    <ParentSize>
      {({ width }) => (
        <VictoryChart
          theme={chartTheme}
          width={width}
          height={width / 1.778}
          domainPadding={{ x: width * 0.1 }}
        >
          <VictoryAxis label={xLabel} />
          <VictoryAxis
            dependentAxis
            label={yLabel}
            tickFormat={t => numeral(Number(t).toLocaleString()).format('0 a')}
          />
          {ranges.map((range, i) => {
            const color = chartTheme.colors[i];
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
          })}
        </VictoryChart>
      )}
    </ParentSize>
  );
};

export { LineChart };
