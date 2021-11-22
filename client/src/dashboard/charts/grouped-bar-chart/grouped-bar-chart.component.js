import React from 'react';

import { VictoryBar, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';
import { BaseChart } from '../base-chart/base-chart.component';
import { GroupedWidthCalculator } from '../utils/width-calculators';

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
    const { barWidth, offset } = GroupedWidthCalculator(data, width);

    return (
      <VictoryGroup offset={offset}>
        {data?.map((arr, i) => (
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

  if (!data) return null;

  return (
    <BaseChart
      xLabel={xLabel}
      yLabel={yLabel}
      renderChart={renderGroupedBarChart}
    />
  );
};

export { GroupedBarChart };
