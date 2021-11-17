import React from 'react';

import { VictoryBar, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';
import { BaseChart } from '../base-chart/base-chart.component';

/**
 * @param {{
 * xLabel?: string
 * yLabel?: string
 * data: any[]
 * }} props
 */
const GroupedBarChart = ({ xLabel = '', yLabel = '', data }) => {
  const chartTheme = useChartTheme();

  const renderGroupedBarChart = width => {
    const barWidth = width / 30,
      offset = width / barWidth;
    return (
      <VictoryGroup offset={offset}>
        {data.map((arr, i) => (
          <VictoryBar
            // eslint-disable-next-line react/no-array-index-key
            key={`dataset-${i}`}
            data={arr}
            style={{
              data: { fill: chartTheme.colors[i], width: barWidth },
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
