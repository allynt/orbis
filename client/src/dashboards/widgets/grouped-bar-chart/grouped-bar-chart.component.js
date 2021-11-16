import React from 'react';

import { VictoryBar, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';
import { BaseChart } from '../base-chart/base-chart.component';

const GroupedBarChart = ({ xLabel = '', yLabel = '', data }) => {
  const chartTheme = useChartTheme();

  // TODO: width and offset responsive values

  const renderGroupedBarChart = width => {
    const barWidth = width / data.length,
      offset = width / barWidth;
    return (
      <VictoryGroup offset={30}>
        {data.map((arr, i) => (
          <VictoryBar
            // eslint-disable-next-line react/no-array-index-key
            key={`dataset-${i}`}
            data={arr}
            style={{
              data: { fill: chartTheme.colors[i], width: 20 },
            }}
          />
        ))}
      </VictoryGroup>
    );
  };

  return (
    <BaseChart
      xLabel={xLabel}
      yLabel={yLabel}
      renderWidget={renderGroupedBarChart}
    />
  );
};

export { GroupedBarChart };
