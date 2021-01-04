import * as React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryGroup,
  VictoryLegend,
  VictoryPie,
} from 'victory';
import orbisChartTheme from '../orbisChartTheme';

/**
 * @param {{
 *   data: {value: number, name: string}[]
 * }} props
 */
export const PieChart = ({ data }) => {
  return (
    <svg viewBox="0 0 500 500">
      <VictoryPie
        theme={orbisChartTheme}
        padding={{ left: 20 }}
        // animate
        standalone={false}
        innerRadius={90}
        // radius={200}
        data={data}
        x={d => d.value}
        y={d => d.value}
        origin={{ x: 500 / 2 }}
        padAngle={2}
        labelRadius={({ innerRadius }) => Number(innerRadius) + 25}
      />
      <VictoryLegend
        theme={orbisChartTheme}
        standalone={false}
        data={data}
        itemsPerRow={2}
        gutter={30}
        orientation="horizontal"
      />
    </svg>
  );
};
