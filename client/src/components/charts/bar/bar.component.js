import * as React from 'react';
import { ColorScale } from 'utils/color';
import { isRealValue } from 'utils/isRealValue';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLine } from 'victory';
import { useChartTheme } from '../useChartTheme';

/**
 * @param {{
 *   data: {x: number, y: number}[]
 *   color: import('typings/orbis').ColorMap | string[]
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
  const orbisChartTheme = useChartTheme();
  const colorScale = new ColorScale({ color, domain, clip });
  const yValues = data?.map(d => d.y);
  return (
    <VictoryChart
      domainPadding={{ x: 20 }}
      theme={orbisChartTheme}
      domain={{ x: domain.map(Number) }}
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
      {isRealValue(line) ? (
        <VictoryLine
          data={[
            { x: line, y: Math.min(...yValues) },
            { x: line, y: Math.max(...yValues) },
          ]}
        />
      ) : null}
    </VictoryChart>
  );
};
