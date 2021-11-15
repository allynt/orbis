import React from 'react';

import { VictoryBar, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';
import { Chart } from '../chart/chart.component';

const GroupedBarChart = ({ xLabel = '', yLabel = '', data }) => {
  const chartTheme = useChartTheme();

  const renderWidget = width => {
    const barWidth = width / data.length;
    const offset = width / barWidth;
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

  return <Chart xLabel={xLabel} yLabel={yLabel} renderWidget={renderWidget} />;
};

export { GroupedBarChart };
