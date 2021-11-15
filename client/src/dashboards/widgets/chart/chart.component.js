import React from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import { VictoryAxis, VictoryChart, VictoryStack } from 'victory';

import { useChartTheme } from '../../useChartTheme';

/**
 * @param {{
 *  x: string
 *  ranges: string[]
 *  xLabel?: string
 *  yLabel?: string
 *  data: any[]
 *  renderRange: (value: string, index: number, array: string[]) => React.ReactNode
 *  stacked: boolean
 * }} props
 */
const Chart = ({
  x = 'x',
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
  data,
  renderRange,
  stacked,
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
          {stacked ? (
            <VictoryStack>{ranges.map(renderRange)}</VictoryStack>
          ) : (
            ranges.map(renderRange)
          )}
        </VictoryChart>
      )}
    </ParentSize>
  );
};

export { Chart };
