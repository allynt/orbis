import * as React from 'react';
import { VictoryAxis, VictoryChart, VictoryLegend, VictoryPie } from 'victory';
import orbisChartTheme from '../orbisChartTheme';

/**
 * @param {{
 *   data: {value: number, name: string}[]
 * }} props
 */
export const PieChart = ({ data }) => {
  return (
    <VictoryChart
      theme={orbisChartTheme}
      height={400}
      padding={{ left: 0, top: 0, right: 0, bottom: 100 }}
    >
      <VictoryAxis
        axisComponent={<></>}
        axisLabelComponent={<></>}
        gridComponent={<></>}
        tickComponent={<></>}
        tickLabelComponent={<></>}
        dependentAxis
      />
      <VictoryAxis
        axisComponent={<></>}
        axisLabelComponent={<></>}
        gridComponent={<></>}
        tickComponent={<></>}
        tickLabelComponent={<></>}
      />
      <VictoryPie
        innerRadius={90}
        data={data}
        x={d => d.value}
        y={d => d.value}
        labelRadius={({ innerRadius }) => Number(innerRadius) + 25}
      />
      <VictoryLegend data={data} />
    </VictoryChart>
  );
};
