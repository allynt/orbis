import React from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import { VictoryAxis, VictoryChart, VictoryStack, VictoryGroup } from 'victory';

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
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
  renderRange,
  stacked,
  grouped,
}) => {
  const chartTheme = useChartTheme();
  const getWrappers = () => {
    if (stacked) {
      return <VictoryStack>{ranges.map(renderRange)}</VictoryStack>;
    } else if (grouped) {
      return <VictoryGroup offset={20}>{ranges.map(renderRange)}</VictoryGroup>;
    } else {
      return ranges.map(renderRange);
    }
  };
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
          {getWrappers()}
        </VictoryChart>
      )}
    </ParentSize>
  );
};

export { Chart };
