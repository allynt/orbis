import * as React from 'react';
import { ColorScale } from 'utils/color';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory';
import orbisChartTheme from '../orbisChartTheme';

export const BarChart = ({ data, color, domain, labelX, labelY }) => {
  const colorScale = new ColorScale({ color, domain });
  return (
    <VictoryChart
      domainPadding={{ x: 20 }}
      domain={{ x: domain }}
      theme={orbisChartTheme}
    >
      <VictoryAxis label={labelX} />
      <VictoryAxis
        dependentAxis
        label={labelY}
        style={{ axisLabel: { padding: 65 } }}
      />
      <VictoryBar
        data={data}
        style={{
          data: {
            fill: ({ datum }) => colorScale.get(datum.x),
          },
        }}
      />
    </VictoryChart>
  );
};
