import * as React from 'react';
import { ColorScale } from 'utils/color';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLine } from 'victory';
import orbisChartTheme from '../orbisChartTheme';

/**
 * @param {{
 *   data: {x: number, y: number}[]
 *   color: ColorMap | string[]
 *   domain: [number, number]
 *   labelX?: string
 *   labelY?: string
 *   line?: number
 * }} props
 */
export const BarChart = ({ data, color, domain, labelX, labelY, line }) => {
  const colorScale = new ColorScale({ color, domain });
  const yValues = data.map(d => d.y);
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
      {line && (
        <VictoryLine
          data={[
            { x: line, y: Math.min(...yValues) },
            { x: line, y: Math.max(...yValues) },
          ]}
        />
      )}
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
