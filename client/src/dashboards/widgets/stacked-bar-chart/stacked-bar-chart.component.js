import React from 'react';

import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from '../base-chart/base-chart.component';

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
  const renderStackedBarChart = width => {
    const barWidth = width / 20;
    return (
      <VictoryStack>
        {ranges.map(range => {
          return (
            <VictoryBar
              key={range}
              data={data}
              x={x}
              y={range}
              style={{
                data: { width: barWidth },
              }}
            />
          );
        })}
      </VictoryStack>
    );
  };

  return (
    <BaseChart
      xLabel={xLabel}
      yLabel={yLabel}
      renderWidget={renderStackedBarChart}
    />
  );
};

export { StackedBarChart };
