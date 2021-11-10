import React from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryStack,
} from 'victory';

import { useChartTheme } from '../../useChartTheme';

const StackedBarWithLineChart = ({
  x = 'x',
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
  data,
}) => {
  const barProps = {
    barRatio: 0.8,
  };
  const chartTheme = useChartTheme();
  return (
    <>
      <ParentSize>
        {({ width }) => (
          <VictoryChart
            theme={chartTheme}
            width={width}
            height={width / 1.778}
            domainPadding={{ x: width * 0.1 }}
          >
            <VictoryLegend
              data={ranges.map(name => ({ name, symbol: { type: 'square' } }))}
            />
            <VictoryAxis
              label={xLabel}
              style={{ grid: { stroke: 'transparent' } }}
            />
            <VictoryAxis
              dependentAxis
              label={yLabel}
              tickFormat={t =>
                numeral(Number(t).toLocaleString()).format('0 a')
              }
            />
            <VictoryStack>
              {ranges.map(range => (
                <VictoryBar
                  key={range}
                  data={data}
                  x={x}
                  y={range}
                  {...barProps}
                />
              ))}
            </VictoryStack>
          </VictoryChart>
        )}
      </ParentSize>
    </>
  );
};

export { StackedBarWithLineChart };
