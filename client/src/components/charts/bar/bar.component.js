import * as React from 'react';
import { ColorScale } from 'utils/color';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLine } from 'victory';
import orbisChartTheme from '../orbisChartTheme';

/**
 * @param {{
 *   data: {x: number, y: number}[]
 *   color: ColorMap | string[]
 *   domain: [number, number]
 *   clip?: [number, number]
 *   labelX?: string
 *   labelY?: string
 *   line?: number
 * }} props
 */
export const BarChart = ({
  data,
  color,
  domain,
  clip,
  labelX,
  labelY,
  line,
}) => {
  const colorScale = new ColorScale({ color, domain, clip });
  const yValues = data?.map(d => d.y);
  return (
    <VictoryChart domainPadding={{ x: 20 }} theme={orbisChartTheme}>
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
      {line && (
        <VictoryLine
          data={[
            { x: line, y: Math.min(...yValues) },
            { x: line, y: Math.max(...yValues) },
          ]}
        />
      )}
    </VictoryChart>
  );
};
