import * as React from 'react';
import { ColorScale } from 'utils/color';
import { VictoryChart, VictoryBar } from 'victory';
import orbisChartTheme from '../orbisChartTheme';

export const BarChart = ({ data, color, domain }) => {
  const colorScale = new ColorScale({ color, domain });
  return (
    <VictoryChart
      domainPadding={{ x: 12 }}
      domain={{ x: domain }}
      padding={90}
      theme={orbisChartTheme}
    >
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
