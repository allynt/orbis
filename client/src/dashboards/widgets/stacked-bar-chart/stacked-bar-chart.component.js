import React from 'react';

import { VictoryBar } from 'victory';

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
  const renderRange = (range, i) => {
    return <VictoryBar key={range} data={data} x={x} y={range} />;
  };
  return (
    <Chart
      x={x}
      ranges={ranges}
      xLabel={xLabel}
      yLabel={yLabel}
      data={data}
      renderRange={renderRange}
      stacked
    />
  );
};

export { StackedBarChart };
