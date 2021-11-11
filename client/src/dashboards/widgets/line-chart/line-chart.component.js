import React from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
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
          <VictoryLine />
          <VictoryScatter />
        </VictoryChart>
      )}
    </ParentSize>
  );
};

export { LineChart };
