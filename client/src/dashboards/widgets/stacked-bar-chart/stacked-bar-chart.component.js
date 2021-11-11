import React from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryStack } from 'victory';

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
const StackedBarChart = ({
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
          <VictoryStack>
            {ranges.map(range => (
              <VictoryBar key={range} data={data} x={x} y={range} />
            ))}
          </VictoryStack>
        </VictoryChart>
      )}
    </ParentSize>
  );
};

export { StackedBarChart };
