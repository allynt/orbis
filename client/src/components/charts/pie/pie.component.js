import * as React from 'react';
import { VictoryLegend, VictoryPie } from 'victory';
import { useChartTheme } from '../useChartTheme';

/**
 * @param {{
 *   data: {value: number, name: string}[]
 *   precision?: number
 * }} props
 */
export const PieChart = ({ data, precision }) => {
  const orbisChartTheme = useChartTheme();
  return (
    <svg width="500" height="260" viewBox="0 0 500 500">
      <VictoryPie
        theme={orbisChartTheme}
        padding={{ left: 20 }}
        standalone={false}
        innerRadius={90}
        // radius={200}
        animate
        data={data}
        x={d => d.value}
        y={d => d.value}
        origin={{ x: 500 / 2 }}
        padAngle={2}
        labels={({ datum }) => datum.value.toFixed(precision)}
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