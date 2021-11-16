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
    // TODO: Responsive barWidth value

    const barWidth = width / 15;
    return (
      <VictoryStack>
        {ranges.map((range, i) => {
          return (
            <VictoryBar
              key={range}
              data={data}
              x={x}
              y={range}
              style={{
                data: { width: 100 },
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
