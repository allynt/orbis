import React from 'react';

import { VictoryBar } from 'victory';

import { Chart } from '../chart/chart.component';

const GroupedBarChart = ({
  x = 'x',
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
  data,
}) => {
  const renderRange = (range, i) => {
    return <VictoryBar key={i} data={data[i]} x={x} y={range} />;
  };

  return (
    <Chart
      ranges={ranges}
      xLabel={xLabel}
      yLabel={yLabel}
      data={data}
      renderRange={renderRange}
      grouped
    />
  );
};

export { GroupedBarChart };
