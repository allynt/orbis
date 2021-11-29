import React from 'react';

import { VictoryBar, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';
<<<<<<< HEAD
import { GroupedWidthCalculator } from '../../utils';
import { BaseChart } from '../base-chart/base-chart.component';
=======
>>>>>>> fix(frontend): Build custom component, upgrade charts, extract componenets

/**
 * @param {{
 * data: any[]
 * width?: number
 * }} props
 */
const GroupedBarChart = ({ data, width }) => {
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

  const barWidth = width / 30,
    offset = width / barWidth;
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

export { GroupedBarChart };
