import React from 'react';

import { VictoryBar, VictoryStack } from 'victory';

import { Chart } from '../chart/chart.component';

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
  const renderWidget = width => {
    const barWidth = width * 0.1;
    return (
      <VictoryStack>
        {ranges.map((range, i) => {
          return <VictoryBar key={range} data={data} x={x} y={range} />;
        })}
      </VictoryStack>
    );
  };

  return <Chart xLabel={xLabel} yLabel={yLabel} renderWidget={renderWidget} />;
};

export { StackedBarChart };
