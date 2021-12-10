import React from 'react';

import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from '../base-chart/base-chart.component';

/**
 * @param {{
 * xLabel?: string
 * yLabel?: string
 *  x: string
 *  ranges: string[]
 *  data: any[]
 *  renderLegend?: (width: number) => React.ReactNode
 * }}
 * props
 */
const StackedBarChart = ({
  xLabel = '',
  yLabel = '',
  x = 'x',
  ranges = ['y'],
  data,
  renderLegend,
}) => {
  if (!data) return null;

  const renderStackedBarChart = width => {
    const barWidth = width / 20;
    return (
      <VictoryStack>
        {!!renderLegend ? renderLegend(width) : null}
        {ranges?.map(range => (
          <VictoryBar
            key={range}
            data={data}
            x={x}
            y={range}
            style={{
              data: { width: barWidth },
            }}
          />
        ))}
      </VictoryStack>
    );
  };

  return (
    <BaseChart
      xLabel={xLabel}
      yLabel={yLabel}
      renderChart={renderStackedBarChart}
      renderLegend={renderLegend}
    />
  );
};

export { StackedBarChart };
